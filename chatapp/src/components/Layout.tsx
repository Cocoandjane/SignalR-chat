import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CurrentUser, ChatList, Input } from './chats'
import MyMessages from './chats/MyMessages'
import OtherMessages from './chats/OtherMessages'
import { useRoom } from '../context/RoomContext';
// import useSignalR from '../useSignalR';
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";

interface props {
    name: string;
}

interface IMessage {
    id: number;
    created_at: Date;
    message: string;
    room_user_id: any;
    user_id: any;
  }
  

export default function Layout({ name }: props) {
    // const { state, dispatch } = useRoom();
    const [chatList, setChatList] = useState([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    // const { connection } = useSignalR("/r/chatHub");
    const [connection, setConnection] = useState<any>(null);
    const { state, setState } = useRoom();
    console.log(chatList);

    // a hoot in another file, handle event and connections of the signalRHub
    // useContext --- yes by ilia


    useEffect(() => {

    }, []);

    useEffect(() => {
        if (name == "Not logged in") {
            window.location.href = "/SignIn";
        }
    }, [name]);
   

    function handleSignOut() {
        window.alert("Sorry, This button is not working yet :(  but you can delete the cookies to sign out :)")
    }


    // You want to have only one SignalR connenction, because making multiple connections will make server to 
    // have more resrouces to handle the connections. So, you want to have only one connection and use it for all the rooms.


    //====================================== SELECT ROOM MAKE ROOM CHANEL==================================================================
    async function handleSelectRoom(chat: any) {
     if(connection){
            await connection.stop();
        }
        console.log('handleSelectRoom called with', chat);
        setState({ user_id: chat.user_id, room_id: chat.room_id, name: chat.name, other_user_id: chat.other_user_id, room_user_id: chat.room_user_id, room_name: chat.room_name });
        // dispatch({ type: 'SET_ROOM_AND_USER', payload: { user_id: chat.user_id, room_id: chat.room_id, name: chat.name, other_user_id: chat.other_user_id, room_user_id: chat.room_user_id } });
        console.log('dispatched payload', { user_id: chat.user_id, room_id: chat.room_id, name: chat.name, other_user_id: chat.other_user_id, room_user_id: chat.room_user_id ,room_name: chat.room_name});
      
        try {
            const room = chat.room_name
            const connection = new HubConnectionBuilder()
                .withUrl('/r/chatHub')
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();
            connection?.on("ReceiveMessage", (user: string, message: string) => {
                console.log("meessage recieved", user, message)
                const newMessage = {
                    id: Math.floor(Math.random() * 1000000),
                    created_at: new Date(),
                    message: message,
                    room_user_id:  user,
                    user_id: chat.user_id
                }
                setMessages((messages) => [...messages, newMessage])
               
            })
            await connection.start();
            await connection?.invoke("JoinRoom", { user: name, room: room});
            
            setConnection(connection);
        } catch (error) {
            console.log(error);
        }
    }
    //====================================== SEND MESSAGE ==================================================================


    function handleSendMessage(message: string) {

        if (+state.room_id == 0) {
            window.alert("please choose a room to chat")
            return;
        }
        if (message == "") {
            return;
        }
        const sendMessage = async (room_id: number, user_id: number, message: string) => {
            try {
                const response = await axios.post(`/api/message?room_id=${room_id}&user_id=${user_id}&message=${message}`);
                if (+state.room_user_id == 0) {
                    return;
                }

                await connection?.invoke("SendMessage", message);
                return response.data; // return the response data if needed
            } catch (error) {
                console.error(error); // log any errors
            }
        }
        sendMessage(+state.room_id, +state.user_id, message)
    }

     //====================================== GET MESSAGES FROM DATABASE ==================================================================
    useEffect(() => {
        if (+state.room_id == 0) {
            return;
        }
        const fetchData = async () => {
            const response = await axios.get(`/api/messages/${+state.room_id}`);
            setMessages(response.data);
        };
        fetchData();
    }, [state.room_id]);



    useEffect(() => {
        if (!name) {
            return;
        }
        const fetchData = async () => {
            const result = await axios.get(`/api/user/${name}`);
            const user_id = result.data.id;
            const response = await axios.get(`/api/rooms/${user_id}`);
            const updatedChatList = response.data.map((chat: any) => {
                return { ...chat, user_id: user_id };
            });
            setChatList(updatedChatList);
            // console.log(response.data)

        };
        fetchData();
    }, [name]);

    console.log(chatList)



    return (
        <div>
            <div className="flex h-screen antialiased text-gray-800">
                <div className="flex flex-row h-full w-full overflow-x-hidden">
                    <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0 ">

                        <CurrentUser name={name} handleSignOut={handleSignOut} />
                        <ChatList name={name} chatList={chatList} setChatList={setChatList} handleSelectRoom={handleSelectRoom} />
                    </div>
                    <div className="flex flex-col flex-auto h-full p-6">
                        <div
                            className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                            <p>{connection ? "Connected" : "Not connected"}</p>
                            {state.name !== "" ? <p className='text-sm text-gray-600'>chatting with {state.name}</p> : <p className='text-sm text-gray-600' >choose a room to chat</p>}
                            <div className="flex flex-col h-full overflow-x-auto mb-4">
                                <div className="flex flex-col h-full">
                                    <div className="grid grid-cols-12 gap-y-2">
                                        {messages
                                            .sort((a: any, b: any) => {
                                                const dateA = new Date(a.created_at);
                                                const dateB = new Date(b.created_at);
                                                return dateA.getTime() - dateB.getTime();
                                            })
                                            .map((message: any) => {
                                                if (message.room_user_id == state.room_user_id || message.room_user_id  == name) {

                                                    return <MyMessages key={message.id} message={message} name={name} />
                                                } else {

                                                    return <OtherMessages key={message.id} message={message} name={state.name} />
                                                }
                                            })}
                                    </div>
                                </div>
                            </div>
                            <Input sendMessage={handleSendMessage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
