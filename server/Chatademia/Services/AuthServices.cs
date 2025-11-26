using chatademia.Data;
using System.Net.Http;
using System.Web;
using System.Security.Cryptography;
using System.Text;

namespace chatademia.Services
{
    public class AuthServices
    {
        private AppDbContext _context;
        private readonly string _USOS_KEY;
        private readonly string _USOS_SECRET;
        private string BASE_URL = "https://usosapps.amu.edu.pl";
        private string REQUEST_TOKEN_URL = "/services/oauth/request_token";
        private string AUTHORIZE_URL = "/services/oauth/authorize";
        private string CALLBACK_URL = "http://localhost:8080/api/Auth/pin";
        private string ACCESS_TOKEN_URL = "/services/oauth/access_token";

        public AuthServices(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _USOS_KEY = config["USOS_KEY"] ?? 
                throw new ArgumentNullException("USOS_KEY is missing from configuration");
            _USOS_SECRET = config["USOS_SECRET"] ?? 
                throw new ArgumentNullException("USOS_SECRET is missing from configuration");
        }

        public void Login(int PIN)
        {
            User new_user = new User();
            new_user.Username = PIN.ToString();
            _context.Users.Add(new_user);
            _context.SaveChanges();
            return;
        }


        public AuthServices(AppDbContext context)
        {
            _context = context;
        }

        private string BuildOAuthHeader(string url, string method)
        {
            string nonce = Guid.NewGuid().ToString("N");
            string timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

            var parameters = new SortedDictionary<string, string>
            {
                { "oauth_callback", CALLBACK_URL },
                { "oauth_consumer_key", _USOS_KEY },
                { "oauth_nonce", nonce },
                { "oauth_signature_method", "HMAC-SHA1" },
                { "oauth_timestamp", timestamp },
                { "oauth_version", "1.0" },
                { "scopes", "offline_access | studies" }
            };

            string parameterString = string.Join("&",
                parameters.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));

            string baseString = $"{method.ToUpper()}&{Uri.EscapeDataString(url)}&{Uri.EscapeDataString(parameterString)}";

            string signingKey = $"{_USOS_SECRET}&";

            using var hasher = new HMACSHA1(Encoding.ASCII.GetBytes(signingKey));
            string signature = Convert.ToBase64String(hasher.ComputeHash(Encoding.ASCII.GetBytes(baseString)));

            parameters.Add("oauth_signature", signature);

            string header = "OAuth " + string.Join(", ",
                parameters.Select(p => $"{p.Key}=\"{Uri.EscapeDataString(p.Value)}\""));

            return header;
        }

        public async Task<string> LoginUrl()
        {
            string requestUrl = BASE_URL + REQUEST_TOKEN_URL;

            Console.WriteLine("=== Step 1: REQUEST TOKEN ===");
            Console.WriteLine("Request URL: " + requestUrl);

            using var client = new HttpClient();

            string authHeader = BuildOAuthHeader(requestUrl, "POST");
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            //var body = new
            //{
                //scopes = new[] { "offline_access", "studies" }
            //};

            //string json = System.Text.Json.JsonSerializer.Serialize(body);
            //var body_serialized = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync(requestUrl, null);
            string content = await response.Content.ReadAsStringAsync();

            Console.WriteLine("Status: " + response.StatusCode);
            Console.WriteLine("Response body:\n" + content);

            var query = HttpUtility.ParseQueryString(content);
            string requestToken = query["oauth_token"];
            string requestSecret = query["oauth_token_secret"];

            Console.WriteLine("\n=== TOKENS RECEIVED ===");
            Console.WriteLine("oauth_token = " + requestToken);
            Console.WriteLine("oauth_token_secret = " + requestSecret);

            string finalUrl = $"{BASE_URL}{AUTHORIZE_URL}?oauth_token={requestToken}";

            Console.WriteLine("\n=== AUTHORIZATION URL ===");
            Console.WriteLine(finalUrl);

            return finalUrl;
        }
    }
}
