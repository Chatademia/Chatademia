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
        public async Task<IActionResult> GetChat([FromBody] ChatIdVM request)
        {
            // Read session token from HttpOnly cookie
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return Unauthorized(new { error = "Brak tokenu sesji" });
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return Unauthorized(new { error = "Nieprawidłowy token sesji" });
            }

            var chat = await _chatServices.GetChat(session, request.ChatId);
            return Ok(chat);
        }

        [HttpPost("chat-messages")]
        public async Task<IActionResult> GetChatMessages([FromBody] ChatIdVM request)
        {
            // Read session token from HttpOnly cookie
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return Unauthorized(new { error = "Brak tokenu sesji" });
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return Unauthorized(new { error = "Nieprawidłowy token sesji" });
            }

            var messages = await _chatServices.GetChatMessages(session, request.ChatId);
            return Ok(messages);
        }        

        [HttpPost("message")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateMessage([FromForm] MessageCreateVM request)
        {
            // Read session token from HttpOnly cookie
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return Unauthorized(new { error = "Brak tokenu sesji" });
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return Unauthorized(new { error = "Nieprawidłowy token sesji" });
            }

            var chat = await _chatServices.CreateMessage(session, request.ChatId, request.Content, request.File);
            return Ok(chat);
        }

        [HttpDelete("message")]
        public async Task<IActionResult> DeleteMessage([FromBody] MessageDeleteVM request)
        {
            // Read session token from HttpOnly cookie
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return Unauthorized(new { error = "Brak tokenu sesji" });
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return Unauthorized(new { error = "Nieprawidłowy token sesji" });
            }

            var chat = await _chatServices.DeleteMessage(session, request.ChatId, request.MessageId);
            return Ok(chat);
        }
        
        [HttpGet("files/{messageId}")]
        public async Task<IActionResult> DownloadFile([FromRoute] Guid messageId)
        {
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return Unauthorized(new { error = "Brak tokenu sesji" });
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return Unauthorized(new { error = "Nieprawidłowy token sesji" });
            }

            var (filePath, fileName) = await _chatServices.DownloadFile(session, messageId);
            return new PhysicalFileResult(filePath, "application/octet-stream")
            {
                FileDownloadName = fileName
            };

        }
        
        [HttpPost("create-chat")]
        public async Task<IActionResult> CreateChat([FromBody] ChatCreateVM request)
        {
            // Read session token from HttpOnly cookie
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return Unauthorized(new { error = "Brak tokenu sesji" });
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return Unauthorized(new { error = "Nieprawidłowy token sesji" });
            }

            var chat = await _chatServices.CreateChat(session, request);
            return Ok(chat);
        }

        [HttpDelete("leave-chat")]
        public async Task<IActionResult> LeaveChat([FromBody] ChatIdVM request)
        {
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return Unauthorized(new { error = "Brak tokenu sesji" });
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return Unauthorized(new { error = "Nieprawidłowy token sesji" });
            }
            var chat = await _chatServices.LeaveChat(session, request.ChatId);
            return Ok(chat);
        }

        [HttpPost("add-user")]
        public async Task<IActionResult> AddUser([FromBody] InviteCodeVM request)
        {
            // Read session token from HttpOnly cookie
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return Unauthorized(new { error = "Brak tokenu sesji" });
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return Unauthorized(new { error = "Nieprawidłowy token sesji" });
            }
            await _chatServices.AddUserToChat(session, request.InviteCode);
            return Ok();
        }
    }
}