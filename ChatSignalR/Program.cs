using ChatSignalR.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Claims;
using ChatSignalR.Hubs;
using System.Text.Json.Serialization;
using ChatSignalR.DTOs;
using Microsoft.AspNetCore.SignalR;
using ChatService;

DotNetEnv.Env.Load();
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDataProtection();
builder.Services.AddControllers();


builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

builder.Services.AddSignalR();


builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opt => new Dictionary<string, UserConnection>());

// I'm prefixing signal r rotuers with r and my controller routes with api
// This is just a style choice for the urls to make the routes more obvious


var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");
var serverVersion = new MySqlServerVersion(new Version(8, 0, 29));

builder.Services.AddDbContext<ChatContextDb>(
    opt =>
    {
        opt
        .UseMySql(connectionString, serverVersion);
        if (builder.Environment.IsDevelopment())
        {
            opt
              .LogTo(Console.WriteLine, LogLevel.Information)
              .EnableSensitiveDataLogging()
              .EnableDetailedErrors();
        }
    }
);

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");
app.MapHub<ChatHub>("/r/chatHub");


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.MapGet("/api/username", (HttpContext context, IDataProtectionProvider idp) =>
{
    var protector = idp.CreateProtector("auth-cookie");
    var authCookie = context.Request.Headers["cookie"].FirstOrDefault(x => x.StartsWith("auth="));
    if (authCookie != null)
    {
        var protectedPayload = authCookie.Split("=")[1];
        authCookie = protector.Unprotect(protectedPayload);
        var username = authCookie.Split(":")[1];
        ;
        Console.WriteLine("==================================");
        Console.WriteLine(username);
        return username;
    }
    return "Not logged in";
});



app.MapGet("/api/login", async (HttpContext context, IDataProtectionProvider idp, string name) =>
{
    var protector = idp.CreateProtector("auth-cookie");

    // Set cookie expiration time to 1 hour from now
    var cookieOptions = new CookieOptions
    {
        Expires = DateTime.Now.AddHours(1),
        HttpOnly = true,
        SameSite = SameSiteMode.Strict,
        Secure = false, // You may want to set this to false for local testing
    };

    // Set the "auth" cookie with the protected value and expiration time
    context.Response.Cookies.Append("auth", protector.Protect($"auth=user:{name}"), cookieOptions);
    //Add the claims during user registration.
    return $"Login successful, {name}";
});


// app.MapGet("/api/logout", (HttpContext context, IDataProtectionProvider idp) =>
// {
//     // delete auth
//     context.Response.Cookies.Delete("auth");
//     return "Logout successful";
// });

// app.MapPost("/api/user", async (ChatContextDb database, string name) =>
// {
//     var user = new User();
//     user.name = name;
//     await database.users.AddAsync(user);
//     await database.SaveChangesAsync();
//     return user;
// });

// get user
app.MapGet("/api/users", async (ChatContextDb database) =>
{
    var users = await database.users.ToListAsync();
    return users;
});

app.MapPost("/api/users/search", async (ChatContextDb database, string name) =>
{
    var users = await database.users
    .Where(u => u.name.Contains(name))
    .ToListAsync();
    return users;
});

app.MapPost("/api/user/{name}", async (ChatContextDb database, string name) =>
{
    var user = new User();
    user.name = name;
    await database.users.AddAsync(user);
    await database.SaveChangesAsync();
    return user;
});

app.MapGet("/api/user/{name}", async (ChatContextDb database, string name) =>
{
    var user = await database.users
    .Where(u => u.name == name)
    .FirstOrDefaultAsync();

    return user;
});

// post a new room and return the room id
app.MapPost("/api/room/{roomName}", async (ChatContextDb database, string roomName) =>
{
    var room = new Room();
    room.created_at = DateTime.Now;
    room.room_name = roomName;
    await database.rooms.AddAsync(room);
    await database.SaveChangesAsync();
    return room.room_id;
});
// check if room exists with 2 users

app.MapGet("/api/room/{user_id}/{user_id2}", async (ChatContextDb database, int user_id, int user_id2) =>
{
    var room = await database.rooms
    .Where(r => r.roomUsers.Any(ru => ru.user_id == user_id) && r.roomUsers.Any(ru => ru.user_id == user_id2))
    .FirstOrDefaultAsync();
    return room;
});

// post to room_user with user_id and room_id
app.MapPost("/api/roomUser/{room_id}/{user_id}", async (ChatContextDb database, int room_id, int user_id) =>
{
    var roomUser = new RoomUser();
    roomUser.user_id = user_id;
    roomUser.room_id = room_id;
    await database.roomUsers.AddAsync(roomUser);
    await database.SaveChangesAsync();
    return roomUser.room_user_id;
});

// get myChatList with user_id



app.MapGet("/api/rooms/{user_id}", async (ChatContextDb database, int user_id) =>
{
    var rooms = await database.rooms
        .Where(r => r.roomUsers.Any(ru => ru.user_id == user_id))
        .ToListAsync();

    var userDTOs = new List<UserDTO>();

    foreach (var room in rooms)
    {
        var usersInRoom = await database.users
            .Where(u => u.roomUsers.Any(ru => ru.room_id == room.room_id && ru.user_id != user_id))
            .Select(u => new UserDTO
            {
                room_id = room.room_id,
                other_user_id = u.id,
                room_name = room.room_name,
                name = u.name,
                latest_message = room.latest_message,
                room_user_id = database.roomUsers
                    .Single(ru => ru.room_id == room.room_id && ru.user_id == user_id)
                    .room_user_id
            })
            .ToListAsync();

        userDTOs.AddRange(usersInRoom);
    }

    return userDTOs;
});


// post a new message
app.MapPost("/api/message", async (ChatContextDb database, int room_id, int user_id, string message) =>
{
    var room_user_id = await database.roomUsers
    .Where(ru => ru.room_id == room_id && ru.user_id == user_id)
    .Select(ru => ru.room_user_id)
    .FirstOrDefaultAsync();

    var newMessage = new Message();
    newMessage.room_user_id = room_user_id;
    newMessage.message = message;
    newMessage.created_at = DateTime.Now;

    await database.messages.AddAsync(newMessage);
    await database.SaveChangesAsync();

    // Create a new object that contains both room_user_id and message
    var messageData = new { room_user_id, message };

    return messageData;
    // return newMessage;
});


// get messages
app.MapGet("/api/messages/{room_id}", async (ChatContextDb database, int room_id) =>
{
    var messages = await database.messages
    .Where(m => m.roomUsers.room_id == room_id)
    .Select(m => new
    {
        room_user_id = m.room_user_id,
        // room_name = m.roomUsers.rooms.room_name,
        message = m.message,
        id = m.message_id,
        created_at = m.created_at
    })
    .ToListAsync();

    return messages;
});

app.Run();
