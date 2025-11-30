using chatademia.Services;
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

        [HttpGet("pin")]
        public async Task<IActionResult> Login([FromQuery] string oauth_token, [FromQuery] string oauth_verifier)
        {
            //Console.WriteLine("oauth_token: " + oauth_token);
            //Console.WriteLine("oauth_verifier: " + oauth_verifier);

            var session = await _loginServices.Login(oauth_token, oauth_verifier);
            return Ok(session);
        }

        [HttpGet("login-url")]
        public async Task<IActionResult> LoginUrl([FromQuery] string callbackUrl)
        {
            var url = await _loginServices.LoginUrl(callbackUrl);
            return Ok(url);
        }

        [HttpGet("user")]
        public async Task<IActionResult> UserData([FromQuery] Guid session)
        {
            var userData = await _loginServices.GetUserData(session);
            return Ok(userData);
        }

        [HttpGet("terminate-session")]
        public async Task TerminateSession([FromQuery] Guid session)
        {
            await _loginServices.TerminateSession(session);
        }
    }
}
