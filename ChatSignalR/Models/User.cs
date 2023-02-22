using System.ComponentModel.DataAnnotations;

namespace ChatSignalR.Models
{
    public class User
    {
        [Key]
        public int id { get; set; }
        public string? name { get; set; }

        public virtual List<RoomUser>? roomUsers { get; set; }

    }
}