using chatademia.Data;
using Chatademia.Data;
using Chatademia.Data.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
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

            return chat;
        }

        public async Task<List<MessageVM>> GetChatMessages(Guid session, Guid chatId)
        {
            //FIXME: Dummy implementation
            var msg1 = new MessageVM()
            {
                Id=Guid.NewGuid(),
                Content="test message 1",
                CreatedAt=DateTime.UtcNow
            };
            var msg2 = new MessageVM()
            {
                Id=Guid.NewGuid(),
                Content="test message 2",
                CreatedAt=DateTime.UtcNow
            };
            var msg3 = new MessageVM()
            {
                Id=Guid.NewGuid(),
                Content="test message 3",
                CreatedAt=DateTime.UtcNow
            };
            return new List<MessageVM>() { msg1, msg2, msg3 };
        }

        public async Task<MessageVM> CreateMessage(Guid session, Guid chatId, string content)
        {
            //FIXME: Dummy implementation
            var new_msg = new MessageVM()
            {
                Id=Guid.NewGuid(),
                Content=content,
                CreatedAt=DateTime.UtcNow
            };
            return new_msg;
        }

        public async Task<IActionResult> DeleteMessage(Guid session, Guid chatId, Guid messageId)
        {
            //FIXME: Dummy implementation
            return null;
        }
    }
}
