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
        public IActionResult Login([FromQuery] string oauth_token, [FromQuery] int oauth_verifier)
        {
            //Console.WriteLine("oauth_token: " + oauth_token);
            //Console.WriteLine("oauth_verifier: " + oauth_verifier);

            _loginServices.Login(oauth_verifier);
            return Ok();
        }

        [HttpGet("login-url")]
        public async Task<IActionResult> LoginUrl()
        {
            var url = await _loginServices.LoginUrl();
            return Ok(url);
        }
    }
}
