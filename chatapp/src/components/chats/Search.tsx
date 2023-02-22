import React, { useState } from 'react'
import axios from 'axios'

interface props {
  name: string;
  chatList: any;
  setChatList: any;
}


export default function Search({ name, chatList,setChatList }: props) {
  const [users, setUsers] = useState<any>([])
  const [searchUserName, setSearchUserName] = useState<string>("")
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
    setSearchUserName(e.currentTarget.value)
    axios.post(`/api/users/search?name=${searchUserName}`)
      .then(response => {
        const searchResult = response.data.filter((user: any) => user.name !== name)
        setUsers(searchResult)
      })
      .catch(error => {
        console.error(error);
      });
    }
    // value is nothing set user to empty array
    if(e.key === 'Backspace' && e.currentTarget.value.length === 1) {
      setUsers([])
    }
  }

  // need to update chatlist after adding a new room
  

  async function addRoomUser(roomId: number, userId: number): Promise<number> {
    try {
      const response = await fetch(`/api/roomUser/${roomId}/${userId}`, {
        method: 'POST'
      });
      const roomUserId = await response.json();
      return roomUserId;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to add RoomUser');
    }
  }



  async function handleSelect(user: any) {
    try {
      const currentUser = await axios.get(`/api/user/${name}`)
      const user_id = currentUser.data.id
      const my_user_id = +currentUser.data.id;
      const searchUser = users.find((user: any) => user.name === searchUserName);
      const search_id = searchUser.id;
      const response = await axios.get(`/api/room/${my_user_id}/${search_id}`);
      const room = response.data;
      console.log(room)
      if (room) {
        console.log('handleSelectRoom called with', user);
        // dispatch({ type: 'SET_ROOM_AND_USER', payload: {other_user_id:user.id, room_id: room.room_id, name: user.name , user_id: user_id} });
        // console.log('dispatched payload', {other_user_id:user.id, room_id: room.room_id, name: user.name , user_id: user_id });
    
      } else {
        const roomName = `${name}-${searchUserName}`
        const newRoom = await axios.post(`/api/room/${roomName}`)
  
        const roomId = newRoom.data
        const currentUser = await axios.get(`/api/user/${name}`)
        const my_user_id = +currentUser.data.id;
        const searchUser = users.find((user: any) => user.name === searchUserName);
        const search_id = searchUser.id;
        const roomUserId = await addRoomUser(roomId, my_user_id)
          // .then(roomUserId => console.log(`RoomUser ID: ${roomUserId}`))
          // .catch(error => console.error(error));

        await addRoomUser(roomId, search_id)
          .then(roomUserId =>
             console.log(`RoomUser ID: ${roomUserId}`))
          .catch(error => console.error(error));
        // need set logic here to set current room
        // sent new room to chatList
      // this is not right, this needs to send to signalR, and push rooms to both user
      // do dispatch here and join room
      
      // this goes to JoinRoom ? 
        const newChat = {
          room_id: roomId,
          room_name: roomName,
          other_user_id: search_id,
          name: searchUserName,
          user_id: my_user_id,
          last_message: "",
          room_user_id: roomUserId,
        }
        setChatList([...chatList, newChat])
        console.log("update room", user)
      }
    } catch (error) {
      console.error(error);
    }
    setUsers([])
    setSearchUserName("")
    // window.location.reload()
  }


  return (
    <>
      <div className="flex flex-row items-center justify-between mt-4">
        <input
          value={searchUserName}
          onKeyDown={handleKeyDown}
          onChange={e => setSearchUserName(e.target.value)}
          type="text"
          className="flex flex-row items-center justify-between w-full h-10 px-4 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search name to chat"
        />
      </div>
      {users.map((user: any) => {
        return (
          <div
            onClick={()=>handleSelect(user)}
            key={user.id} className="ml-2 text-sm font-semibold">
            <div className='flex place-items-center gap-2 '>
              <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                {user.name[0]}
              </div>
              <div className="ml-2 text-sm font-semibold">{user.name}</div>
            </div>
          </div>
        )
      })}
    </>

  )
}
