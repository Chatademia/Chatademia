using chatademia.Data;
using Chatademia.Data;
using Chatademia.Data.ViewModels;
using Microsoft.EntityFrameworkCore;
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

            var chat = await _context.Chats
                .Where(c => c.Id == Id)
                .Select(c => new ChatVM
                {
                    CourseId = c.CourseId,
                    Name = c.Name
                })
            .FirstOrDefaultAsync();

            return chat;
        }
    }
}
