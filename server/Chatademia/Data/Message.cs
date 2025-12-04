using System.ComponentModel.DataAnnotations;

namespace Chatademia.Data
{
    public class Message
    {
        [Key]
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Content { get; set; }
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
