namespace Chatademia.Data
{
    public class Chat
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string UsosId { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public int Color { get; set; }
        public string? InviteCode { get; set; }
        public List<UserChatMTMRelation> UserChatsMTMR { get; set; } = new List<UserChatMTMRelation>();
        public List<Message> Messages { get; set; } = new List<Message>();
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
