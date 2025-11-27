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

            await _loginServices.Login(oauth_token, oauth_verifier);
            return Ok();
        }

        [HttpGet("login-url")]
        public async Task<IActionResult> LoginUrl()
        {
            var url = await _loginServices.LoginUrl();
            return Ok(url);
        }

        [HttpGet("user-data")]
        public async Task<IActionResult> UserData([FromQuery] string oauth_token, [FromQuery] string oauth_verifier)
        {
            var userData = await _loginServices.GetUserData(oauth_token, oauth_verifier);
            return Ok(userData);
        }
    }
}
