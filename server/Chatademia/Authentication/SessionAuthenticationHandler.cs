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
                return AuthenticateResult.NoResult();
            }

            if (!Guid.TryParse(sessionToken, out var session))
            {
                return AuthenticateResult.Fail("Invalid session token");
            }

            using var context = _factory.CreateDbContext();

            var sessionExists = await context.UserTokens
                .AnyAsync(t => t.Session == session);

            if (!sessionExists)
                return AuthenticateResult.Fail("Session not found");

            var claims = new[]
            {
                new Claim("session_id", session.ToString())
            };


            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);

        }
    }
}
