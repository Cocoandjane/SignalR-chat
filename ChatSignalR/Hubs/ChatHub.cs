using System;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using ChatService;

namespace ChatSignalR.Hubs
{
    public class ChatHub : Hub
    {
        // public override Task OnConnectedAsync()
        // {
        //     Console.WriteLine("A Client Connected: " + Context.ConnectionId);
        //     return base.OnConnectedAsync();
        // }

        // public override Task OnDisconnectedAsync(Exception exception)
        // {
        //     Console.WriteLine("A client disconnected: " + Context.ConnectionId);
        //     return base.OnDisconnectedAsync(exception);

        // }

        private readonly string _botUser;

        private readonly IDictionary<string, UserConnection> _connections;

        public ChatHub(IDictionary<string, UserConnection> connections){
            _botUser = "MyChat Bot";

            _connections = connections;
        }

        public async Task SendMessage(string message)
        {
            if(_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.Group(userConnection.Room)
                .SendAsync("ReceiveMessage", userConnection.User, message);

            }
            else
            {
                await Clients.Caller.SendAsync("ReceiveMessage", _botUser, "You are not connected to a room");
            }
        }
        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

            _connections.Add(Context.ConnectionId, userConnection);

            // await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has joined the room");
        }

       
    }
}

