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
        public async Task<IActionResult> UserData([FromQuery] Guid session)
        {
            var userData = await _usersServices.GetUserData(session);
            return Ok(userData);
        }
    }
}
