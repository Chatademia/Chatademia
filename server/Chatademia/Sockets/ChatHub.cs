using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Chatademia.Sockets
{
    [Authorize]
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
            await base.OnConnectedAsync();
        }
    }
}