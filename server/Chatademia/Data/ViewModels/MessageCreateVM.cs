namespace Chatademia.Data.ViewModels
{
    public class MessageCreateVM
    {
        public Guid ChatId { get; set; }
        public string? Content { get; set; }
        public IFormFile? File { get; set; } 
    }
}
