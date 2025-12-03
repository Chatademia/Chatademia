namespace Chatademia.Data
{
    public class Chat
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string CourseId;
        public string Name { get; set; }
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
