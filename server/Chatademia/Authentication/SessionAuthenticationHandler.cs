using chatademia.Data;
using Chatademia.Data.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace Chatademia.Authentication
{
    public class SessionAuthenticationHandler 
        : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IDbContextFactory<AppDbContext> _factory;

        public SessionAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            IDbContextFactory<AppDbContext> factory)
            : base(options, logger, encoder)
            {
                _factory = factory;
            }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Cookies.TryGetValue("session_token", out var sessionToken))
            {
                return AuthenticateResult.Fail("Missing session token");
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return AuthenticateResult.Fail("Invalid session token");
            }

            using var context = _factory.CreateDbContext();

            // Find the user associated with this session
            var user = await context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                return AuthenticateResult.Fail("Session not found");

            var claims = new List<Claim>
            {
                new Claim("session_id", session.ToString()),
                // Required by SignalR hub to put connection into user-specific group
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };


            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);

        }
    }
}
