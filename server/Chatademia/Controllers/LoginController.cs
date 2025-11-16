using chatademia.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace chatademia.Controllers
{
    [ApiController]
    //[Route("api/login")]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        public LoginServices _loginServices;

        public LoginController(LoginServices loginServices)
        {
            _loginServices = loginServices;
        }

        [HttpPost("pin")]
        public IActionResult Login(int PIN)
        {
            _loginServices.Login(PIN);
            return Ok();
        }
    }
}
