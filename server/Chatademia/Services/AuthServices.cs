using chatademia.Data;
using Chatademia.Data;
using Chatademia.Data.ViewModels;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using System.Web;

namespace Chatademia.Services
{
    public class AuthServices
    {
        private readonly IDbContextFactory<AppDbContext> _factory;
        private readonly string _USOS_KEY;
        private readonly string _USOS_SECRET;
        private readonly string _CLIENT_ID;
        private readonly string _CLIENT_SECRET;
        private string BASE_URL = "https://usosapps.amu.edu.pl";
        private string REQUEST_TOKEN_URL = "/services/oauth/request_token";
        private string ACCESS_TOKEN_URL = "/services/oauth/access_token";
        private string AUTHORIZE_URL = "/services/oauth/authorize";
        private string USER_URL = "/services/users/user";

        private string BuildOAuthHeaderAcces(string url, string method, string oauth_token,string oauth_verifier, string oauth_token_secret)
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
                { "oauth_verifier", oauth_verifier},
                { "oauth_token", oauth_token}
            };

            string parameterString = string.Join("&",
                parameters.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));

            string baseString = $"{method.ToUpper()}&{Uri.EscapeDataString(url)}&{Uri.EscapeDataString(parameterString)}";

            string signingKey = $"{_USOS_SECRET}&{oauth_token_secret}";

            using var hasher = new HMACSHA1(Encoding.ASCII.GetBytes(signingKey));
            string signature = Convert.ToBase64String(hasher.ComputeHash(Encoding.ASCII.GetBytes(baseString)));

            parameters.Add("oauth_signature", signature);

            string header = "OAuth " + string.Join(", ",
                parameters.Select(p => $"{p.Key}=\"{Uri.EscapeDataString(p.Value)}\""));

            return header;
        }

        private string BuildOAuthHeaderRequest(string url, string method, string callbackURL)
        {
            string nonce = Guid.NewGuid().ToString("N");
            string timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

            var parameters = new SortedDictionary<string, string>
            {
                { "oauth_callback", callbackURL },
                { "oauth_consumer_key", _USOS_KEY },
                { "oauth_nonce", nonce },
                { "oauth_signature_method", "HMAC-SHA1" },
                { "oauth_timestamp", timestamp },
                { "oauth_version", "1.0" },
                { "scopes", "offline_access|studies" }
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

            UserVM user_data = new UserVM();
            user_data.Id = id;
            user_data.FirstName = firstName;
            user_data.LastName = lastName;
            if(firstName.Length > 0)
                user_data.ShortName = firstName[0].ToString().ToUpper();
            if (lastName.Length > 0)
                user_data.ShortName += lastName[0].ToString().ToUpper();

            return user_data;
        }

        public AuthServices(IDbContextFactory<AppDbContext> factory, IConfiguration config)
        {
            _factory = factory;
            _USOS_KEY = config["USOS_KEY"] ?? 
                throw new ArgumentNullException("USOS_KEY is missing from configuration");
            _USOS_SECRET = config["USOS_SECRET"] ?? 
                throw new ArgumentNullException("USOS_SECRET is missing from configuration");
            _CLIENT_ID = config["CLIENT_ID"] ??
                throw new ArgumentNullException("CLIENT_ID is missing from configuration");
            _CLIENT_SECRET = config["CLIENT_SECRET"] ??
                throw new ArgumentNullException("CLIENT_SECRET is missing from configuration");
        }

        public async Task<SessionVM> Login(string oauth_token,string oauth_verifier)
        {
            using var _context = _factory.CreateDbContext();
            TempUser tempUser = await _context.TempUsers.FirstOrDefaultAsync(u => u.OAuthToken == oauth_token);

            string requestUrl = BASE_URL + ACCESS_TOKEN_URL;

            Console.WriteLine("=== Step 1: ACCESS TOKEN ===");
            Console.WriteLine("Request URL: " + requestUrl);
            Console.WriteLine("Request token secret : " + tempUser.OAuthTokenSecret);

            using var client = new HttpClient();

            string authHeader = BuildOAuthHeaderAcces(requestUrl, "POST", oauth_token, oauth_verifier, tempUser.OAuthTokenSecret);
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            var response = await client.PostAsync(requestUrl, null);
            string content = await response.Content.ReadAsStringAsync();

            Console.WriteLine("Login");
            Console.WriteLine("Status: " + response.StatusCode);
            Console.WriteLine("Response body:\n" + content);

            var query = HttpUtility.ParseQueryString(content);
            string accessToken = query["oauth_token"].ToString();
            string accessSecret = query["oauth_token_secret"].ToString();

            Console.WriteLine("\n=== TOKENS RECEIVED ===");
            Console.WriteLine("oauth_token_acces = " + accessToken);
            Console.WriteLine("oauth_token_secret_acces = " + accessSecret);


            // are access_tokens present in db?
            var userTokens = await _context.UserTokens.FirstOrDefaultAsync(u => 
            (u.PermaAccessToken == accessToken && u.PermaAccessTokenSecret == accessSecret));

            // access_tokens present in db
            if (userTokens != null)
            {
                Console.WriteLine("Tokens found in database");
                if (userTokens.Session == null) // no session yet
                {
                    Console.WriteLine("No session found, creating new session");
                    Guid new_session = Guid.NewGuid();
                    userTokens.Session = new_session;
                    await _context.SaveChangesAsync();
                }

                return new SessionVM { Session = userTokens.Session.Value }; // retrun session
            }
            else // access_tokens not in db
            {
                Console.WriteLine("Tokens not found in database, saving new tokens");
                tempUser.PermaAccessToken = accessToken;
                tempUser.PermaAccessTokenSecret = accessSecret;

                Guid new_session = Guid.NewGuid();

                Console.WriteLine("Querying user data from USOS");
                UserVM user_data = await QueryUser(accessToken, accessSecret);

                var old_user = await _context.Users
                    .Include(u => u.UserTokens)
                    .FirstOrDefaultAsync(u => u.Id == user_data.Id);

                // found user in db
                if (old_user != null)
                {
                    //NOTE: if should we update the short name and color as well?
                    Console.WriteLine("Found user in db");
                    // update user data
                    old_user.FirstName = user_data.FirstName;
                    old_user.LastName = user_data.LastName;
                    old_user.ShortName = user_data.ShortName;
                    old_user.Color = old_user.Color;
                    old_user.UpdatedAt = DateTimeOffset.UtcNow;

                    // update tokens
                    old_user.UserTokens.PermaAccessToken = accessToken;
                    old_user.UserTokens.PermaAccessTokenSecret = accessSecret;
                    old_user.UserTokens.Session = new_session;
                    

                    await _context.SaveChangesAsync();
                    return new SessionVM { Session = old_user.UserTokens.Session.Value };
                }
                else // user not found in db
                {
                    Console.WriteLine("User not found in db, creating new user");
                    User new_user = new User
                    {
                        Id = user_data.Id,
                        FirstName = user_data.FirstName,
                        LastName = user_data.LastName,
                        ShortName = user_data.ShortName,
                        Color = Random.Shared.Next(0,10),
                        IsUsosAccount = true,
                        UserTokens = new UserTokens
                        {
                            PermaAccessToken = accessToken,
                            PermaAccessTokenSecret = accessSecret,
                            Session = new_session
                        }
                    };
                    _context.Users.Add(new_user);
                    await _context.SaveChangesAsync();
                    return new SessionVM { Session = new_user.UserTokens.Session.Value };
                }
            }
        }

        public async Task<string> LoginUrl(string callbackURL) // REMOVE FULL CUSTOMIZATION OF CALLBACK
        {
            using var _context = _factory.CreateDbContext();
            string requestUrl = BASE_URL + REQUEST_TOKEN_URL;

            Console.WriteLine("=== Step 1: REQUEST TOKEN ===");
            Console.WriteLine("Request URL: " + requestUrl);

            using var client = new HttpClient();

            string authHeader = BuildOAuthHeaderRequest(requestUrl, "POST", callbackURL);
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            var bodyParams = new Dictionary<string,string>
            {
                { "scopes", "offline_access|studies" }
            };

            var body = new FormUrlEncodedContent(bodyParams);
            var response = await client.PostAsync(requestUrl, body);
            string content = await response.Content.ReadAsStringAsync();

            Console.WriteLine("LoginUrl");
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

            TempUser tempUser = new TempUser();
            tempUser.OAuthToken = requestToken;
            tempUser.OAuthTokenSecret = requestSecret;
            await _context.TempUsers.AddAsync(tempUser);
            await _context.SaveChangesAsync();


            return finalUrl;
        }

        public async Task TerminateSession(Guid session)
        {
            using var _context = _factory.CreateDbContext();

            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);
            
            if(user == null)
            throw new Exception($"Invalid session");

            Console.WriteLine("Terminating session…\n");
            user.UserTokens.Session = null;

            await _context.SaveChangesAsync();
            return;
        }

        public async Task<string> GoogleLoginUrl(string callbackURL) // REMOVE FULL CUSTOMIZATION OF CALLBACK
        {
            using var _context = _factory.CreateDbContext();

            var state = Guid.NewGuid().ToString("N");


            var url =
            "https://accounts.google.com/o/oauth2/v2/auth" +
            "?response_type=code" +
            "&client_id=" + Uri.EscapeDataString(_CLIENT_ID) +
            "&redirect_uri=" + Uri.EscapeDataString("http://localhost:8080/api/auth/google/callback") +
            //"&scope=" + Uri.EscapeDataString("openid email profile") +
            "&scope=" + Uri.EscapeDataString("openid profile") +
            "&state=" + state;

            var tempUser = new GoogleTempUser();
            tempUser.State = state;
            tempUser.Callback = callbackURL;
            await _context.GoogleTempUsers.AddAsync(tempUser);
            await _context.SaveChangesAsync();

            return url;
        }


        public class GoogleTokenResponse
        {
            public string access_token { get; set; } = string.Empty;
            public string id_token { get; set; } = string.Empty;
            public int expires_in { get; set; }
            public string token_type { get; set; } = string.Empty;
        }

        private async Task<GoogleJsonWebSignature.Payload> ValidateIdToken(string idToken)
        {
            return await GoogleJsonWebSignature.ValidateAsync(
                idToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _CLIENT_ID }
                });
        }

        public async Task<(string, SessionVM)> GoogleCallback(string code, string state)
        {
            using var _context = _factory.CreateDbContext();

            var tempUser = _context.GoogleTempUsers.FirstOrDefault(u => u.State == state);

            if (tempUser == null)
            {
                throw new Exception("Invalid state");
            }

            var callback = tempUser.Callback;

            var http = new HttpClient();

            var response = await http.PostAsync(
                "https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["code"] = code,
                    ["client_id"] = _CLIENT_ID,
                    ["client_secret"] = _CLIENT_SECRET,
                    ["redirect_uri"] = "http://localhost:8080/api/auth/google/callback",
                    ["grant_type"] = "authorization_code"
                })
            );

            //Console.WriteLine(await response.Content.ReadFromJsonAsync());

            response.EnsureSuccessStatusCode(); 

            var content = await response.Content.ReadFromJsonAsync<GoogleTokenResponse>();

            var payload = await ValidateIdToken(content.id_token);
            Console.WriteLine("=== Google ID Token Payload ===");
            Console.WriteLine($"Subject (sub): {payload.Subject}"); //primary key
            //Console.WriteLine($"Email: {payload.Email}");
            //Console.WriteLine($"Email verified: {payload.EmailVerified}");
            //Console.WriteLine($"Name: {payload.Name}");
            Console.WriteLine($"Given name: {payload.GivenName}");
            Console.WriteLine($"Family name: {payload.FamilyName}");
            //Console.WriteLine($"Picture: {payload.Picture}");
            //Console.WriteLine($"Issuer: {payload.Issuer}");
            //Console.WriteLine($"Audience: {string.Join(",", payload.Audience)}");
            Console.WriteLine($"Issued at: {payload.IssuedAtTimeSeconds}");
            Console.WriteLine($"Expiration: {payload.ExpirationTimeSeconds}");
            //Console.WriteLine($"Hosted domain (hd): {payload.HostedDomain}");

            var oldUser = _context.Users.FirstOrDefault(u => u.Id == payload.Subject);

            if (oldUser == null) // if new user
            {
                var newUser = new User
                {
                    Id = payload.Subject,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    ShortName = (payload.GivenName.Length > 0 ? payload.GivenName[0].ToString().ToUpper() : "") +
                            (payload.FamilyName.Length > 0 ? payload.FamilyName[0].ToString().ToUpper() : ""),
                    Color = Random.Shared.Next(0, 10),
                    IsUsosAccount = false,
                    UserTokens = new UserTokens
                    {
                        Session = Guid.NewGuid()
                    }
                };

                _context.Remove(tempUser);          
                await _context.AddAsync(newUser);
                await _context.SaveChangesAsync();

                return (callback, new SessionVM { Session = newUser.UserTokens.Session.Value });
            }
            else // refresh data
            {
                oldUser.FirstName = payload.GivenName;
                oldUser.LastName = payload.FamilyName;
                oldUser.ShortName = (payload.GivenName.Length > 0 ? payload.GivenName[0].ToString().ToUpper() : "") +
                        (payload.FamilyName.Length > 0 ? payload.FamilyName[0].ToString().ToUpper() : "");
                oldUser.UserTokens.Session = Guid.NewGuid();
                _context.Remove(tempUser);
                await _context.SaveChangesAsync();

                return (callback, new SessionVM { Session = oldUser.UserTokens.Session.Value });
            }           
        }


    }
}
