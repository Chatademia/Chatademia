using chatademia.Data;
using Chatademia.Data;
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
        private string CHAT_URL = "/services/groups/participant";

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

        private string BuildOAuthHeaderChat(string url, string method, string oauth_token, string oauth_verifier)
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
                { "fields", "course_id|course_name" },
                { "active_terms", "true" }
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
            if(firstName.Length > 0)
                user_data.ShortName = firstName[0].ToString().ToUpper();
            if (lastName.Length > 0)
                user_data.ShortName += lastName[0].ToString().ToUpper();
            user_data.Color = Random.Shared.Next(0,10);

            return user_data;
        }

        private class Term
        {
            public string id { get; set; }
            public Name name { get; set; }
            public string start_date { get; set; }
            public string end_date { get; set; }
            public bool is_active { get; set; }
        }

        private class Name
        {
            public string pl { get; set; }
            public string en { get; set; }
        }

        private class Course
        {
            public string course_id { get; set; }
            public CourseName course_name { get; set; }
            public string term_id { get; set; }
        }

        private class CourseName
        {
            public string pl { get; set; }
            public string en { get; set; }
        }

        private class ChatResponse
        {
            public Dictionary<string, List<Course>> groups { get; set; }
            public List<Term> terms { get; set; }
        }

        private int? ParseSemester(string courseId)
        {
            if (string.IsNullOrEmpty(courseId))
                return null;

            int index = courseId.IndexOf("IN", StringComparison.OrdinalIgnoreCase);
            if (index < 0)
                return null;

            string semStr = courseId.Length >= index + 3
                ? courseId.Substring(courseId.IndexOf("IN") + 2, 2)
                : null;

            if (int.TryParse(semStr, out int semester))
                return semester;
            else
                return semester;
        }

        private async Task<List<Chat>> QueryChat(string access_token, string access_token_secret)
        {
            using var _context = _factory.CreateDbContext();
            
            string requestUrl = BASE_URL + CHAT_URL;

            using var client = new HttpClient();

            string authHeader = BuildOAuthHeaderChat(requestUrl, "Post", access_token, access_token_secret);
            client.DefaultRequestHeaders.Add("Authorization", authHeader);

            var bodyParams = new Dictionary<string,string>
            {
                { "fields", "course_id|course_name" },
                { "active_terms", "true" }
            };

            var body = new FormUrlEncodedContent(bodyParams);
            var response = await client.PostAsync(requestUrl, body);
            string content = await response.Content.ReadAsStringAsync();

            var chatData = JsonSerializer.Deserialize<ChatResponse>(content);

            //FIXME: ENSURE ONLY THE GROUPS WITH VAILD DATE ARE ADDED
            var chats = chatData.groups
                .SelectMany(g => g.Value)
                .Select(c => new Chat
                {
                    Id = Guid.NewGuid(),
                    UsosId = c.course_id,
                    Semester = ParseSemester(c.course_id),
                    Name = c.course_name.pl,
                    ShortName = string.Concat(c.course_name.pl.Split(' ', StringSplitOptions.RemoveEmptyEntries).Take(2).Select(word => char.ToUpper(word[0]))),
                    Color = Random.Shared.Next(0,10) // Assuming a default color value, update as needed
                })
                .ToList();

            return chats;
        }

        public async Task<UserVM> GetUserData(Guid session)
        {
            using var _context = _factory.CreateDbContext();

            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");


            if (user.UpdatedAt.AddHours(24) < DateTimeOffset.UtcNow) // data may need to be refreshed
            {
                string access_token = user.UserTokens.PermaAccessToken;
                string access_token_secret = user.UserTokens.PermaAccessTokenSecret;  
                user.UpdatedAt = DateTimeOffset.UtcNow;  
                return await QueryUser(access_token, access_token_secret);
            }
            else 
            {
                UserVM user_data = new UserVM();
                user_data.Id = user.Id;
                user_data.FirstName = user.FirstName;
                user_data.LastName = user.LastName;
                user_data.ShortName = user.ShortName;
                user_data.Color = user.Color;

                return user_data;
            }
        }




        public async Task<List<ChatVM>> GetUserChats(Guid session)
        {
            using var _context = _factory.CreateDbContext();

            var user = await _context.Users
                .Include(u => u.UserTokens)
                .FirstOrDefaultAsync(u => u.UserTokens.Session == session);

            if (user == null)
                throw new Exception($"Invalid session");

            // data may need to be refreshed
            if (!user.ChatsUpdatedAt.HasValue || user.ChatsUpdatedAt?.AddHours(24) < DateTimeOffset.UtcNow)
            {
                string access_token = user.UserTokens.PermaAccessToken;
                string access_token_secret = user.UserTokens.PermaAccessTokenSecret;
                user.ChatsUpdatedAt = DateTimeOffset.UtcNow;

                await _context.SaveChangesAsync();

                var chats = await QueryChat(access_token, access_token_secret);

                //FIXME: MAke sure we check if the chat already exist in db then only create a new chta groupe if it doses not exitst

                var incomingChats = await QueryChat(access_token, access_token_secret);
                var incomingChatUIds = incomingChats.Select(c => c.UsosId).ToList();
                var incomingChatGIds = incomingChats.Select(c => c.Id).ToList();

                // Load chats that already exist
                var existingChats = await _context.Chats
                    .Where(c => incomingChatUIds.Contains(c.UsosId))
                    .ToListAsync();

                // Find new chats that do NOT exist yet
                var newChats = incomingChats
                    .Where(inChat => existingChats.All(dbChat => dbChat.UsosId != inChat.UsosId))
                    .ToList();

                // Add new chats
                if (newChats.Any())
                {
                    _context.Chats.AddRange(newChats);
                    await _context.SaveChangesAsync();
                }

                // Reload all chats from DB (now both old + newly inserted)
                var allChats = await _context.Chats
                    .Where(c => incomingChatUIds.Contains(c.UsosId))
                    .ToListAsync();

                // Load existing relations for this user
                var existingRelations = await _context.UserChatMTMRelations
                    .Where(rc => rc.UserId == user.Id && incomingChatGIds.Contains(rc.ChatId) && rc.IsRelationActive == true)
                    .ToListAsync();

                // Add missing relations
                var newRelations = allChats
                    .Where(chat => existingRelations.All(rel => rel.ChatId != chat.Id))
                    .Select(chat => new UserChatMTMRelation
                    {
                        UserId = user.Id,
                        ChatId = chat.Id
                    })
                    .ToList();

                if (newRelations.Any())
                {
                    _context.UserChatMTMRelations.AddRange(newRelations);
                    await _context.SaveChangesAsync();
                }

            }
            var chatVMs = await _context.Chats
            .Select(c => new ChatVM
            {
                Id = c.Id,
                Name = c.Name,
                Semester = c.Semester,
                ShortName = c.ShortName,
                Color = c.Color,
                InviteCode = c.InviteCode,
                Participants = c.UserChatsMTMR
                    .Select(uc => uc.User)
                    .Distinct()
                    .Select(u => new UserVM
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        ShortName = u.ShortName,
                        Color = u.Color,
                    })
                    .ToList()
            }).ToListAsync();

            return chatVMs;
        }
    }
}
