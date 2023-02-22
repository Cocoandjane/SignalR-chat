namespace ChatSignalR.DTOs
{
    public class UserDTO
    {
        public int other_user_id { get; set; }
        public string name { get; set; }

        public int room_id { get; set; }

        public string room_name { get; set; }

        public int room_user_id { get; set; }

        public string latest_message { get; set; }
        public virtual List<RoomUserDTO> roomUsers { get; set; }
    }
}