using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatSignalR.Models
{
    public class Message
    {
        [Key]
        public int message_id { get; set; }

        public string? message { get; set; }
        public DateTime created_at { get; set; }
        public int room_user_id { get; set; }
        [ForeignKey("room_user_id")]
        public RoomUser? roomUsers { get; set; }

    }
}