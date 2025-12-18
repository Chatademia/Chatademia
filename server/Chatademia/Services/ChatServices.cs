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

            var chat = await _context.Chats
                .Where(c => c.Id == Id && c.UserChatsMTMR.Any(uc => uc.UserId == user.Id))
                .Select(c => new ChatVM
                {
                    Id = c.Id,
                    Name = c.Name,
                    ShortName = c.ShortName,
                    Color = c.Color
                })
            .FirstOrDefaultAsync();

            if (chat == null)
                throw new Exception($"Chat not found");

            var userChats = await _context.UserChatMTMRelations
                .Where(uc => uc.ChatId == chat.Id)
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
                message.filePath = await UploadFile(session, file);
                message.oldFileName = file.FileName;
                message.Content = $"{BASE_URL}/api/chat/files/{message.Id}";

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
                new_msg.fileName = message.oldFileName;
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
                Color = chatData.Color ?? 0
            };

            _context.Chats.Add(chat);

            var userChatRelation = new UserChatMTMRelation
            {
                UserId = user.Id,
                ChatId = chat.Id
            };

            _context.UserChatMTMRelations.Add(userChatRelation);

            await _context.SaveChangesAsync();

            var chatVM = new ChatVM
            {
                Id = chat.Id,
                Name = chat.Name,
                ShortName = chat.ShortName,
                Color = chat.Color,
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
    }
}
