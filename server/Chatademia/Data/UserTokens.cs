namespace Chatademia.Data
{
    public class UserTokens
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? PermaAccessToken { get; set; }
        public string? PermaAccessTokenSecret { get; set; }
        public Guid? Session { get; set; }
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
