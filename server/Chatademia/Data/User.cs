using System.ComponentModel.DataAnnotations;

namespace chatademia.Data
{
    public class User
    {
        [Key]
        public Guid Id { get; init; } = Guid.NewGuid();
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string OAuthToken { get; set; } = "";
        public string OAuthTokenSecret { get; set; } = "";
        public string PermaAccessToken { get; set; } = ""; // TO REMOVE FIELD!
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        public List<Message> Messages { get; set; } = new List<Message>();
    }
}
