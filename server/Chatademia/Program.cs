using Microsoft.EntityFrameworkCore;
using chatademia.Data;
using Scalar.AspNetCore;
using Chatademia.Services;
using Chatademia.Sockets;
using Microsoft.AspNetCore.Authentication;
using Chatademia.Authentication;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000",
                "https://chatademia.social") 
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi();

//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContextFactory<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddTransient<AuthServices>();
builder.Services.AddTransient<UsersServices>();
builder.Services.AddTransient<ChatServices>();
builder.Services.AddSignalR();

builder.Services.AddRouting(options =>
{
    options.LowercaseUrls = true;
});

builder.Services
    .AddAuthentication("Session")
    .AddScheme<AuthenticationSchemeOptions, SessionAuthenticationHandler>(
        "Session", options => { });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<ChatHub>("/chatademia/chatHub");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("AllowFrontend");

app.MapControllers();

app.Urls.Add("http://0.0.0.0:8080");

app.Run();
