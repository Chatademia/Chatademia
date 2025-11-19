using chatademia.Data;

namespace chatademia.Services
{
    public class AuthServices
    {
        private AppDbContext _context;
        private readonly string _USOS_KEY;
        private readonly string _USOS_SECRET;

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
            // Implement login logic here
            return;
        }

        public string LoginUrl()
        {
            // Implement login URL logic here
            return "https://example.com/login";
        }
    }
}
