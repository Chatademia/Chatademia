using Chatademia.Data.ViewModels;
using Chatademia.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace chatademia.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        public AuthServices _loginServices;

        public AuthController(AuthServices loginServices)
        {
            _loginServices = loginServices;
        }

        [HttpPost("session")]
        public async Task<IActionResult> Login([FromBody] SessionRequestVM request)
        {
            var session = await _loginServices.Login(request.OauthToken, request.OauthVerifier);
            return Ok(session);
        }

        [HttpGet("login-url")]
        public async Task<IActionResult> LoginUrl([FromQuery] string callbackUrl)
        {
            var url = await _loginServices.LoginUrl(callbackUrl);
            return Ok(url);
        }

        [HttpDelete("session")]
        public async Task<IActionResult> TerminateSession([FromQuery] Guid session)
        {
            await _loginServices.TerminateSession(session);
            return Ok();
        }
    }
}
