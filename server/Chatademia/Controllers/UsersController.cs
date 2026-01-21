using Chatademia.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Chatademia.Controllers
{
    [Authorize]
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
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var userData = await _usersServices.GetUserData(session);
            return Ok(userData);
        }

        [HttpGet("chats")]
        public async Task<IActionResult> GetChats()
        {
            var session = Guid.Parse(User.FindFirstValue("session_id"));

            var chats = await _usersServices.GetUserChats(session);
            return Ok(chats);
        }
    }
}
