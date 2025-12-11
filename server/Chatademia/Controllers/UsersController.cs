using Chatademia.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Chatademia.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        public UsersServices _usersServices;

        public UsersController(UsersServices userServices) 
        {
            _usersServices = userServices;
        }

        [HttpGet("user")]
        public async Task<IActionResult> UserData()
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

            var userData = await _usersServices.GetUserData(session);
            return Ok(userData);
        }

        [HttpGet("chats")]
        public async Task<IActionResult> GetChats()
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

            var chats = await _usersServices.GetUserChats(session);
            return Ok(chats);
        }
    }
}
