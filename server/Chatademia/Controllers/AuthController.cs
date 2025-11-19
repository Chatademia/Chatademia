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

        [HttpPost("pin")]
        public IActionResult Login(int PIN)
        {
            _loginServices.Login(PIN);
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
