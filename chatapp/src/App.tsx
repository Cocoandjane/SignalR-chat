import { useEffect, useState } from "react";
import "./App.css";
import useSignalR from "./useSignalR";
import axios from "axios";

import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";

export default function App() {
  const [name, setName] = useState('');

 
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/api/username");
      setName(response.data);
    }
    fetchData();
  }, []);



  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout name={name} 
           />}></Route>
          <Route path='/SignIn' element={<SignIn />}></Route>
          <Route path='/SignUp' element={<SignUp />}></Route>
        </Routes>
      </div>
    </Router>
  );

  // const { connection } = useSignalR("/r/chatHub");
  // const [message, setMessage] = useState("")

  // // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // //   e.preventDefault()
  // //   // sent private message to user
  // //   connection?.invoke("ReceivePrivateMessage", message, connection.connectionId)
  // // }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   // send private message to user
  //   connection?.invoke("SendPrivateMessage", message, connection.connectionId)
  // }

  // // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // //   e.preventDefault()
  // //   // Send the message to signal r
  // //   connection?.invoke("SendMessage", message)
  // // }
  // useEffect(() => {
  //   if (!connection) {
  //     return
  //   }
  //   // listen for messages from the server
  //   connection.on("ReceivePrivateMessage", (message, connectionId) => {
  //     console.log("message from the server", message,connectionId)
  //   })

  //   return () => {
  //     connection.off("ReceivePrivateMessage")
  //   }
  // }, [connection])


  // return (
  //   <>
  //     <div className="App">
  //       <h1>SignalR Chat</h1>
  //       <p>{connection ? "Connected" : "Not connected"}</p>
  //     </div>
  //     <form onSubmit={handleSubmit}>
  //       <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
  //       <button type="submit">Send</button>
  //     </form>
  //   </>
  // );
}
