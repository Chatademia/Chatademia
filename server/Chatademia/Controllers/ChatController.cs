using Chatademia.Data.ViewModels;
using Chatademia.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chatademia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        public ChatServices _chatServices;

        public ChatController(ChatServices chatServices)
        {
            _chatServices = chatServices;
        }
        [HttpPost("chat")]
        public async Task<IActionResult> GetChat([FromBody] SessionChatVM request)
        {
            var chat = await _chatServices.GetChat(request.Session, request.ChatId);
            return Ok(chat);
        }

        [HttpPost("chat-messages")]
        public async Task<IActionResult> GetChatMessages([FromBody] SessionChatVM request)
        {
            var messages = await _chatServices.GetChatMessages(request.Session, request.ChatId);
            return Ok(messages);
        }        

        [HttpPost("message")]
        public async Task<IActionResult> CreateMessage([FromBody] SessionMsgCreateVM request)
        {
            var chat = await _chatServices.CreateMessage(request.Session, request.ChatId, request.Content);
            return Ok(chat);
        }

        [HttpDelete("message")]
        public async Task<IActionResult> DeleteMessage([FromBody] SessionMsgDeleteVM request)
        {
            var chat = await _chatServices.DeleteMessage(request.Session, request.ChatId, request.MessageId);
            return Ok(chat);
        }
    }


}
