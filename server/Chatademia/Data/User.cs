using Chatademia.Data;
using System.ComponentModel.DataAnnotations;

namespace Chatademia.Data
{
    public class User
    {
        [Key]
        public string Id { get; set; }// = Guid.NewGuid();
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";        
        public string ShortName { get; set; } = "";
        public int Color { get; set; } = 0;
        public bool IsUsosAccount { get; set; }
        public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? ChatsUpdatedAt { get; set; }
        public List<UserChatMTMRelation> UserChatsMTMR { get; set; } = new List<UserChatMTMRelation>();
        public List<Message> Messages { get; set; } = new List<Message>();
        public UserTokens UserTokens { get; set; } = new UserTokens();
    }
}
