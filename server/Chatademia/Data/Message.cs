using System.ComponentModel.DataAnnotations;

namespace chatademia.Data
{
    public class Message
    {
        [Key]
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Content { get; set; }
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; init; } = DateTimeOffset.UtcNow;

        public required Guid UserId { get; init; }
    }
}
