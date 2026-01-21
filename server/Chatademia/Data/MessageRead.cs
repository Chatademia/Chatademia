namespace Chatademia.Data
{
    public class MessageRead
    {
        public Guid Id { get; set; }

        public Guid MessageId { get; set; }
        public Message Message { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public DateTimeOffset? ReadAt { get; set; } = null;
    }
}
