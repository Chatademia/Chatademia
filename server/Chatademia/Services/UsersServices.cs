using chatademia.Data;
using Chatademia.Data.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Buffers.Text;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Chatademia.Services
{
    public class UsersServices
    {
        private readonly IDbContextFactory<AppDbContext> _factory;
        private readonly string _USOS_KEY;
        private readonly string _USOS_SECRET;
        private string BASE_URL = "https://usosapps.amu.edu.pl";
        private string USER_URL = "/services/users/user";

        public UsersServices(IDbContextFactory<AppDbContext> factory, IConfiguration config)
        {
            _factory = factory;
            _USOS_KEY = config["USOS_KEY"] ??
                throw new ArgumentNullException("USOS_KEY is missing from configuration");
            _USOS_SECRET = config["USOS_SECRET"] ??
                throw new ArgumentNullException("USOS_SECRET is missing from configuration");
        }


        private string BuildOAuthHeaderUser(string url, string method, string oauth_token, string oauth_verifier)
        {
            string nonce = Guid.NewGuid().ToString("N");
            string timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

            var parameters = new SortedDictionary<string, string>
            {
                { "oauth_consumer_key", _USOS_KEY },
                { "oauth_nonce", nonce },
                { "oauth_signature_method", "HMAC-SHA1" },
                { "oauth_timestamp", timestamp },
                { "oauth_version", "1.0" },
                //{ "oauth_verifier", oauth_verifier},
                { "oauth_token", oauth_token},
                { "fields", "id|first_name|last_name" }
            };

            string parameterString = string.Join("&",
                parameters.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));

            string baseString = $"{method.ToUpper()}&{Uri.EscapeDataString(url)}&{Uri.EscapeDataString(parameterString)}";

            string signingKey = $"{_USOS_SECRET}&{oauth_verifier}";

            using var hasher = new HMACSHA1(Encoding.ASCII.GetBytes(signingKey));
            string signature = Convert.ToBase64String(hasher.ComputeHash(Encoding.ASCII.GetBytes(baseString)));

            parameters.Add("oauth_signature", signature);

            string header = "OAuth " + string.Join(", ",
                parameters.Select(p => $"{p.Key}=\"{Uri.EscapeDataString(p.Value)}\""));

            return header;
        }

        private async Task<UserVM> QueryUser(string access_token, string access_token_secret)
        {

            string requestUrl = BASE_URL + USER_URL;

            using var client = new HttpClient();

            string authHeader = BuildOAuthHeaderUser(requestUrl, "GET", access_token, access_token_secret);
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            var response = await client.GetAsync(requestUrl);
            string content = await response.Content.ReadAsStringAsync();

            Console.WriteLine("UserData");
            Console.WriteLine("Status: " + response.StatusCode);
            Console.WriteLine("Response body:\n" + content);

            var data = JsonSerializer.Deserialize<Dictionary<string, string>>(content);

            string id = data["id"];
            string firstName = data["first_name"];
            string lastName = data["last_name"];

            Console.WriteLine("user data: " + firstName + lastName);

            //user.FirstName = firstName; //crossed for now
            //user.LastName = lastName; //crossed for now

            UserVM user_data = new UserVM();
            user_data.Id = id;
            user_data.FirstName = firstName;
            user_data.LastName = lastName;

            return user_data;
        }

        public async Task<UserVM> GetUserData(Guid session)
        {
            using var _context = _factory.CreateDbContext();

            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            string access_token = user.UserTokens.PermaAccessToken;
            string access_token_secret = user.UserTokens.PermaAccessTokenSecret;

            return await QueryUser(access_token, access_token_secret);
        }
    }
}
