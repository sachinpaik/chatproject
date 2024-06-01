'use client'
import React, {useState, useEffect} from 'react';
import io from "socket.io-client";
import {useAuthStore} from "@/app/zustand/useAuthStore";
import axios from "axios";
import {useUserStore} from "@/app/zustand/useUserStore";
import ChatUsers from "@/app/_Components/ChatUsers";
import {useChatReceiverStore} from "@/app/zustand/useChatReceiverStore";
import {useChatMsgsStore} from "@/app/zustand/useChatMsgsStore";


export const getUserData = async () => {
    const res = await axios.get('http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:80/users',
        {
            withCredentials: true
        });
    return res
    //updateUsers(res.data);
}

const Chat = () => {
    const [msg, setMsg] = useState('');
    const [socket, setSocket] = useState(null);
    //const [msgs, setMsgs] = useState([])
    const [time, setTime] = useState('');
    const {authName} = useAuthStore();
    const {updateUsers} = useUserStore();
    const {chatReceiver} = useChatReceiverStore();
    const {chatMsgs, updateChatMsgs} = useChatMsgsStore();

    // const getUserData = async () => {
    //     const res = await axios.get('http://localhost:8081/users',
    //         {
    //             withCredentials: true
    //         })
    //     console.log(res.data);
    //     updateUsers(res.data);
    // }


    useEffect(() => {
        // Establish WebSocket connection
        const newSocket = io('http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:8081', {
            query: {
                username: authName
            }
        });
        getUserData().then((response)=>{
            updateUsers(response.data);
        }).catch(exception=>{
            updateUsers([])
        });
        setSocket(newSocket);
        newSocket.on('chat msg', (msgrecv) => {
            console.log('received msg on client ' + msgrecv);
            console.log(...chatMsgs);
            updateChatMsgs(msgrecv);
        });
        return () => newSocket.close();
    }, []);


    useEffect(() => {

        console.log(JSON.stringify(chatMsgs));

    }, [chatMsgs]);

    const sendMsg = (e) => {
        e.preventDefault();
        const msgToBeSent = {
            sender: authName,
            receiver: chatReceiver,
            text: msg
        };
        if (socket) {
            socket.emit('chat msg', msgToBeSent);
            updateChatMsgs(msgToBeSent);
            setMsg('');

        }
    }

    return (
        <div className='h-screen flex divide-x-4'>
            <div className='w-1/5'>
                <ChatUsers/>
            </div>
            <div className='w-4/5'>

                <div className='1/5'>
                    <h1>
                        {authName} Chatting with {chatReceiver}
                    </h1>
                </div>
                <div className='msgs-container h-4/5 overflow-scroll'>
                    {chatMsgs?.map((msg, index) => (
                        <div key={index} className={` m-3 ${msg.sender === authName ? 'text-right' : 'text-left'}`}>
                  <span className={`${msg.sender !== authName ? 'bg-blue-200' : 'bg-green-200'} p-3 rounded-lg`}>
                       {msg.text}
                   </span>
                        </div>
                    ))}
                </div>
                <div className='h-1/5 flex items-center justify-center'>
                    <form onSubmit={sendMsg} className="w-1/2">
                        <div className="relative">
                            <input type="text"
                                   value={msg}
                                   onChange={(e) => setMsg(e.target.value)}
                                   placeholder="Type your text here"
                                   required
                                   className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            <button type="submit"
                                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default Chat
