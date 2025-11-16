using System.ComponentModel.DataAnnotations;

namespace chatademia.Data
{
    public class User
    {
        [Key]
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Username { get; set; }
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; init; } = DateTimeOffset.UtcNow;

        public List<Message> Messages { get; set; } = new List<Message>();
    }
}
