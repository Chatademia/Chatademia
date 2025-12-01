namespace Chatademia.Data
{
    public class TempUser
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? OAuthToken { get; set; }
        public string? OAuthTokenSecret { get; set; }
        public string? PermaAccessToken { get; set; }
        public string? PermaAccessTokenSecret { get; set; }  
    }
}
