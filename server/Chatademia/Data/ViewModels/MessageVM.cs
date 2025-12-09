namespace Chatademia.Data.ViewModels
{
    public class MessageVM
    {
        public Guid? Id { get; set; }
        public string? Content { get; set; }

        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}
