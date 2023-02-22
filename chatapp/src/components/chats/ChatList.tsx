import React, { useEffect }from 'react'
import Search from './Search'
import { useRoom } from '../../context/RoomContext';
// import useSignalR from '../../useSignalR';

interface Props {
  name: string;
  chatList: any;
  setChatList: any;
  handleSelectRoom: any;
}

export default function ChatList({ chatList, setChatList, name ,handleSelectRoom}: Props) {

  return (

    <div className="flex flex-col mt-8">

      <Search name={name} chatList={chatList} setChatList={setChatList} />

      <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">

        {chatList.map((chat: any) => (
          <button
            onClick={() => handleSelectRoom(chat)}
            key={chat.room_id}
            className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
          >
            <div
              className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
            >
              {chat.name[0]}
            </div>
            <div className="ml-2 text-sm font-semibold">{chat.name}</div>
          </button>
        ))
        }
      </div>
    </div>

  )
}
