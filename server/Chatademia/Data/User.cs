using System.ComponentModel.DataAnnotations;

namespace chatademia.Data
{
    public class User
    {
        [Key]
        public string Id { get; set; }// = Guid.NewGuid();
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string OAuthToken { get; set; } = "";
        public string OAuthTokenSecret { get; set; } = "";
        public string PermaAccessToken { get; set; } = ""; // TO REMOVE FIELD!
        public string PermaAccessTokenSecret { get; set; } = ""; // TO REMOVE FIELD!
        public Guid? Session { get; set; }
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        public List<Message> Messages { get; set; } = new List<Message>();
    }
}
