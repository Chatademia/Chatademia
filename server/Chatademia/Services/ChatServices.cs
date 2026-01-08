using chatademia.Data;
using Chatademia.Data;
using Chatademia.Data.ViewModels;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
using System;
using System.Buffers.Text;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Chatademia.Services
{
    public class ChatServices
    {
        private readonly IDbContextFactory<AppDbContext> _factory;
        private readonly string BASE_URL = "http://localhost:8080";

        public ChatServices(IDbContextFactory<AppDbContext> factory)
        {
            _factory = factory;
        }

        private async Task<string> CodeGenerator()
        {
            const string chars = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
            const int inviteCodeLength = 6;
            string code = string.Concat(
                Enumerable.Range(0, inviteCodeLength)
                .Select(_ => chars[RandomNumberGenerator.GetInt32(chars.Length)])
            );

            return code;
        }

        private async Task<string> UploadFile(Guid session, IFormFile file)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);
            if (user == null)
                throw new Exception($"Invalid session");

            if (file == null || file.Length == 0)
                throw new Exception("Empty file");

            const long MaxFileSize = 10 * 1024 * 1024; // 10 MB

            if (file.Length > MaxFileSize)
                throw new Exception("File too large");

            string path = Path.Combine(AppContext.BaseDirectory, "storage", user.Id);

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            var extension = Path.GetExtension(file.FileName);
            var safeFileName = $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(path, safeFileName);

            using var stream = new FileStream(filePath, FileMode.CreateNew);

            await file.CopyToAsync(stream);

            Console.WriteLine($"Saved file to: {filePath}");
            return filePath;
        }

        public async Task<ChatVM> GetChat(Guid session, Guid Id)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            var dbchat = await _context.Chats
                .Where(c => c.Id == Id && c.UserChatsMTMR.Any(uc => uc.UserId == user.Id && uc.IsRelationActive == true))
                .FirstOrDefaultAsync();

            if (dbchat == null)
                throw new Exception($"Chat not found");

            // Refresh code if older than 4 days
            if (dbchat.LastInviteCodeRefresh?.AddDays(4) <= DateTimeOffset.UtcNow)
            {
                dbchat.OldInviteCode = dbchat.InviteCode;
                dbchat.InviteCode = await CodeGenerator();
                dbchat.LastInviteCodeRefresh = DateTimeOffset.UtcNow;
            }
            await _context.SaveChangesAsync();
          
            var chat = new ChatVM
            {
                Id = dbchat.Id,
                Name = dbchat.Name,
                ShortName = dbchat.ShortName,
                Color = dbchat.Color,
            };
            if (dbchat.InviteCode != null)
                chat.InviteCode = dbchat.InviteCode;


            var userChats = await _context.UserChatMTMRelations
                .Where(uc => uc.ChatId == chat.Id && uc.IsRelationActive == true)
                .Include(uc => uc.User)
                .ToListAsync();
                chat.Participants = userChats.Select(uc => new UserVM
                {
                    Id = uc.User.Id,
                    FirstName = uc.User.FirstName,
                    LastName = uc.User.LastName,
                    ShortName = uc.User.ShortName,
                    Color = uc.User.Color
                }).ToList();

            return chat;
        }

        public async Task<List<MessageVM>> GetChatMessages(Guid session, Guid chatId)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            var messages = _context.Messages
                .Where(m => m.ChatId == chatId && m.IsDeleted == false)            
                .Select(m => new MessageVM
                {
                    Id = m.Id,
                    SenderId = m.UserId,
                    Content = m.Content,
                    Type = m.Type,
                    FileName = m.Type == "file" ? m.oldFileName : null,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt,
                }).ToList();
            


            if (messages == null)
                throw new Exception($"Chat not found");

            return messages;
        }

        public async Task<MessageVM> CreateMessage(Guid session, Guid chatId, string content, IFormFile file)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            string type;
            if (string.IsNullOrWhiteSpace(content) && file != null)
                type = "file";
            else if (!string.IsNullOrWhiteSpace(content) && file == null)
                type = "text";
            else
                throw new Exception("One and only one of content and file must be provided");

            var message = new Message
                {
                    Id = Guid.NewGuid(),
                    Type = type,
                    ChatId = chatId,
                    UserId = user.Id,
                    CreatedAt = DateTime.UtcNow,
                    IsDeleted = false,
                };

            if (type == "text")
                message.Content = content;
            else if (type == "file")
            {
                message.filePath = await UploadFile(session, file);
                message.oldFileName = file.FileName;
                message.Content = $"{BASE_URL}/api/chat/files/{message.Id}";
            }

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var new_msg = new MessageVM()
            {
                Id = message.Id,
                SenderId = message.UserId,
                Type = type,
                Content = message.Content,
                CreatedAt = message.CreatedAt
            };

            if (type == "file")
                new_msg.FileName = message.oldFileName;
            return new_msg;
        }

        public async Task<IActionResult> DeleteMessage(Guid session, Guid chatId, Guid messageId)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == messageId && m.ChatId == chatId);

            if (message == null)
                throw new Exception("Message not found");

            message.IsDeleted = true;
            message.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return null;
        }

        public async Task<(string, string)> DownloadFile(Guid session, Guid messageId)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            var message = await _context.Messages
                .FirstOrDefaultAsync(m => m.Id == messageId && m.Type == "file");

            if (message == null || message.IsDeleted)
                throw new Exception("File message not found");

            var filePath = message.filePath;

            if (!System.IO.File.Exists(filePath))
                throw new Exception("File not found in db");

            var fileName = message.oldFileName;


            return (filePath, fileName);

        }

        public async Task<ChatVM> CreateChat(Guid session, ChatCreateVM chatData)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            Guid ID = Guid.NewGuid();
            var chat = new Chat
            {
                Id = ID,
                UsosId = ID.ToString(),
                Name = chatData.Name,
                ShortName = string.Concat(chatData.Name.Split(' ', StringSplitOptions.RemoveEmptyEntries).Take(2).Select(word => char.ToUpper(word[0]))),
                Color = chatData.Color ?? 0,
                InviteCode = await CodeGenerator(),
                LastInviteCodeRefresh = DateTimeOffset.UtcNow
            };

            await _context.Chats.AddAsync(chat);

            var userChatRelation = new UserChatMTMRelation
            {
                UserId = user.Id,
                ChatId = chat.Id
            };

            _context.UserChatMTMRelations.AddAsync(userChatRelation);

            await _context.SaveChangesAsync();

            var chatVM = new ChatVM
            {
                Id = chat.Id,
                Name = chat.Name,
                ShortName = chat.ShortName,
                Color = chat.Color,
                InviteCode = chat.InviteCode,
                Participants = new List<UserVM>
                {
                    new UserVM
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        ShortName = user.ShortName,
                        Color = user.Color
                    }
                }
            };

            return chatVM;
        }
        public async Task<IActionResult> LeaveChat(Guid session, Guid? chatId)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            var chatRelation = await _context.UserChatMTMRelations
                .FirstOrDefaultAsync(uc => uc.ChatId == chatId && uc.UserId == user.Id && uc.IsRelationActive == true);

            if (chatRelation == null)
                throw new Exception("Relation not found");

            chatRelation.IsRelationActive = false;

            var chat = await _context.Chats
                .FirstOrDefaultAsync(c => c.Id == chatId);
            
            chat.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return null;
        }
        public async Task JoinChat(Guid session, string inviteCode)
        {
            using var _context = _factory.CreateDbContext();

            var chat = await _context.Chats
                .FirstOrDefaultAsync(c => c.InviteCode == inviteCode || c.OldInviteCode == inviteCode);

            if (chat == null)
                throw new Exception($"Invalid invite code");

            var user = await _context.Users
                .FirstOrDefaultAsync(c => c.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");
            
            var alreadyInChat = await _context.Set<UserChatMTMRelation>()
                .AnyAsync(uc => uc.ChatId == chat.Id && uc.UserId == user.Id);

            if (alreadyInChat)
                throw new Exception($"User already in chat");

            await _context.AddAsync(new UserChatMTMRelation
            {
                ChatId = chat.Id,
                UserId = user.Id
            });

            await _context.SaveChangesAsync();

            return;
        }
    }
}
