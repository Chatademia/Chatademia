namespace Chatademia.Data.ViewModels
{
    public class ChatVM
    {
        public Guid? Id { get; set; }

        public int? Semester { get; set; }
        public string? Name { get; set; }

        public string? ShortName { get; set; }
        public int? Color { get; set; }
        public string? InviteCode { get; set; }
        public bool? IsFavorite { get; set; }
        public string? ModeratorId { get; set; }

        public List<UserVM>? Participants { get; set; }
    }
}
