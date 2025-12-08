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
        [HttpGet("chat")]
        public async Task<IActionResult> GetChat([FromHeader] Guid session, Guid Id)
        {
            var chat = await _chatServices.GetChat(session, Id);
            return Ok(chat);
        }
    }
}
