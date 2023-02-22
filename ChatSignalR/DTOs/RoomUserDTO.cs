namespace ChatSignalR.DTOs
{
    public class RoomUserDTO
    {
        public int room_user_id { get; set; }
        public int room_id { get; set; }
        public int user_id { get; set; }
        public virtual RoomDTO rooms { get; set; }
        public virtual UserDTO users { get; set; }
    }
}