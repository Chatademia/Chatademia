namespace Chatademia.Data
{
    public class GoogleTempUser
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? State { get; set; }
        public string? Callback { get; set; }
    }
}
