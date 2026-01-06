using Chatademia.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Chatademia.Data
{
    [PrimaryKey(nameof(UserId), nameof(ChatId))]
    public class UserChatMTMRelation
    {
        public Guid ChatId { get; set; }
        public Chat Chat { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public bool IsRelationActive { get; set; } = true;
    }
}
