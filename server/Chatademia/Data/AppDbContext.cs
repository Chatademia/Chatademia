using Chatademia.Data;
using Microsoft.EntityFrameworkCore;

namespace chatademia.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserTokens> UserTokens { get; set; }
        public DbSet<TempUser> TempUsers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Chat> Chats { get; set; }
    }
}
