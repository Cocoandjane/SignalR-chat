namespace ChatSignalR.DTOs
{
    public class RoomDTO
    {
     
         public int room_id { get; set; }

        public string latest_message { get; set; }

        public DateTime created_at { get; set; }

        public virtual ICollection<RoomUserDTO>? roomUsers { get; set; }



    }

}