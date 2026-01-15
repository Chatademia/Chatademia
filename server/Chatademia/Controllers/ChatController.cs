using Chatademia.Data.ViewModels;
using Chatademia.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Chatademia.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        public ChatServices _chatServices;

        public ChatController(ChatServices chatServices)
        {
            _chatServices = chatServices;
        }
        //[HttpPost("chat")]
        //public async Task<IActionResult> GetChat([FromBody] ChatIdVM request)
        //{
        //    // Read session token from HttpOnly cookie
        //    if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
        //    {
        //        return Unauthorized(new { error = "Brak tokenu sesji" });
        //    }

        //    if (!Guid.TryParse(sessionToken, out var session))
        //    {
        //        return Unauthorized(new { error = "Nieprawidłowy token sesji" });
        //    }

        //    var chat = await _chatServices.GetChat(session, request.ChatId);
        //    return Ok(chat);
        //}

        [HttpGet("chat-messages")]
        public async Task<IActionResult> GetChatMessages([FromBody] ChatIdVM request)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var messages = await _chatServices.GetChatMessages(session, request.ChatId);
            return Ok(messages);
        }        

        [HttpPost("message")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateMessage([FromForm] MessageCreateVM request)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var chat = await _chatServices.CreateMessage(session, request.ChatId, request.Content, request.File);
            return Ok(chat);
        }

        [HttpDelete("message")]
        public async Task<IActionResult> DeleteMessage([FromBody] MessageDeleteVM request)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var chat = await _chatServices.DeleteMessage(session, request.ChatId, request.MessageId);
            return Ok(chat);
        }
        
        [HttpGet("files/{messageId}")]
        public async Task<IActionResult> DownloadFile([FromRoute] Guid messageId)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var (filePath, fileName) = await _chatServices.DownloadFile(session, messageId);
            return new PhysicalFileResult(filePath, "application/octet-stream")
            {
                FileDownloadName = fileName
            };

        }
        
        [HttpPost("create-chat")]
        public async Task<IActionResult> CreateChat([FromBody] ChatCreateVM request)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var chat = await _chatServices.CreateChat(session, request);
            return Ok(chat);
        }

        [HttpDelete("leave-chat")]
        public async Task<IActionResult> LeaveChat([FromBody] ChatIdVM request)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var chat = await _chatServices.LeaveChat(session, request.ChatId);
            return Ok(chat);
        }

        [HttpDelete("remove-user-as-moderator")]
        public async Task<IActionResult> RemoveUser([FromBody] ChatRemoveUserVM request)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var chat = await _chatServices.RemoveUser(session, request.ChatId, request.UserToRemoveId);
            return Ok(chat);
        }

        [HttpPost("join-chat")]
        public async Task<IActionResult> JoinChat([FromBody] InviteCodeVM request)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            await _chatServices.JoinChat(session, request.InviteCode);
            return Ok();
        }

        [HttpPost("favorite-status")]
        public async Task<IActionResult> SetFavoriteStatus([FromBody] SetFavoriteChatVM request)
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var response = await _chatServices.SetFavoriteStatus(session, request);
            return Ok(response);
        }
    }
}