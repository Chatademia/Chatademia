using Chatademia.Data.ViewModels;
using Chatademia.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Web;

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
            Response.Cookies.Append(
            "session_token",
            session.Session.ToString(),
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Change to true in production with HTTPS
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(1)
            });

            return Ok(new { session = session.Session.ToString() });
        }

        [HttpGet("login-url")]
        public async Task<IActionResult> LoginUrl([FromQuery] string callbackUrl) // REMOVE FULL CUSTOMIZATION OF CALLBACK
        {
            var url = await _loginServices.LoginUrl(callbackUrl);
            return Ok(url);
        }

        [HttpDelete("session")]
        public async Task<IActionResult> TerminateSession()
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

            await _loginServices.TerminateSession(session);

            // Clear the cookie
            Response.Cookies.Delete("session_token", new CookieOptions
            {
                Path = "/",
                SameSite = SameSiteMode.Lax
            });

            return Ok();
        }

        [HttpGet("google/login-url")]
        public async Task<IActionResult> GoogleLoginUrl([FromQuery] string callbackUrl) // REMOVE FULL CUSTOMIZATION OF CALLBACK
        {
            var url = await _loginServices.GoogleLoginUrl(callbackUrl);
            return Ok(url);
        }

        [HttpGet("google/callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string state)
        {
            var response = await _loginServices.GoogleCallback(code, state);
            Response.Cookies.Append(
            "session_token",
            response.Item2.Session.ToString(),
            new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Change to true in production with HTTPS
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(1)
            });

            return Redirect(response.Item1);
        }
    }
}
