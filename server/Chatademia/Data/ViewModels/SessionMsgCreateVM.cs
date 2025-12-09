namespace Chatademia.Data.ViewModels
{
    public class SessionMsgCreateVM
    {
        public Guid Session { get; set; }
        public Guid ChatId { get; set; }
        public string? Content { get; set; }
    }
}
