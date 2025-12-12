using chatademia.Data;
using Chatademia.Data;
using Chatademia.Data.ViewModels;
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

        public ChatServices(IDbContextFactory<AppDbContext> factory)
        {
            _factory = factory;
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
                    Content = m.Content,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt
                }).ToList();

            if (messages == null)
                throw new Exception($"Chat not found");

            return messages;
        }

        public async Task<MessageVM> CreateMessage(Guid session, Guid chatId, string content)
        {
            using var _context = _factory.CreateDbContext();
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            var message = new Message
            {
                Id = Guid.NewGuid(),
                Content = content,
                ChatId = chatId,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var new_msg = new MessageVM()
            {
                Id = message.Id,
                Content = message.Content,
                CreatedAt = message.CreatedAt
            };
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
    }
}
