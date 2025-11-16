using chatademia.Data;

namespace chatademia.Services
{
    public class LoginServices
    {
        private AppDbContext _context;

        public LoginServices(AppDbContext context)
        {
            _context = context;
        }

        public void Login(int PIN)
        {
            // Implement login logic here
        }
    }
}
