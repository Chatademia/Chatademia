using System.ComponentModel.DataAnnotations;

namespace Chatademia.Data
{
    public class Message
    {
        [Key]
        public Guid Id { get; init; } = Guid.NewGuid();
        public string? Content { get; set; }
        public string? filePath { get; set; }
        public string Type { get; set; }

        public Guid ChatId { get; set; }
        public Chat Chat { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }
}
