namespace Chatademia.Data.ViewModels
{
    public class SessionMsgDeleteVM
    {
        public Guid Session { get; set; }
        public Guid ChatId { get; set; }
        public Guid MessageId { get; set; }
    }
}
