using Microsoft.AspNetCore.SignalR;

namespace Chatademia.Sockets
{
    public class ChatHub : Hub
    {
        //TAKE THE GUID AND TURN IT INTO A STRING?
        public async Task JoinChatSubscription(Guid chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
        }

        public async Task NotifyChatSubscriptionMessageWasSent(Guid chatId)
        {
            await Clients.Group(chatId.ToString()).SendAsync("NEW MSG");
        }

        public async Task QuitChatSubscription(Guid chatId)agfag
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId.ToString());
        }
    }
}