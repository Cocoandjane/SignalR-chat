using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ChatSignalR.Models
{
    public class RoomUser
    {
        [Key]
        public int room_user_id { get; set; }

        public int room_id { get; set; }
        [ForeignKey("room_id")]
        public virtual Room? rooms { get; set; }

        public int user_id { get; set; }
        [ForeignKey("user_id ")]
        public virtual User? users { get; set; }

        public virtual List<Message>? messages { get; set; }

    }
}