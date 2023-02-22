using System.ComponentModel.DataAnnotations;

namespace ChatSignalR.Models
{

    public class Room
    {
        [Key]
        public int room_id { get; set; }

        public string room_name { get; set; }

        public string? latest_message { get; set; }

        public DateTime created_at { get; set; }

        public virtual List<RoomUser>? roomUsers { get; set; }
    }
}