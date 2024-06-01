"use client"
import React, {useEffect} from 'react';
import {useUserStore} from "@/app/zustand/useUserStore";
import {useChatReceiverStore} from "@/app/zustand/useChatReceiverStore";
import {useChatMsgsStore} from "@/app/zustand/useChatMsgsStore";
import axios from "axios";
import {useAuthStore} from "@/app/zustand/useAuthStore";


const ChatUsers = () => {

    const {users} = useUserStore();
    const {chatReceiver, updateChatReceiver} = useChatReceiverStore();
    const {authName} = useAuthStore();
    const {chatMsgs, newChatMsgs,updateChatMsgs,resetChatMsgs} = useChatMsgsStore();

    const setChatReceiver = (user) => {
        updateChatReceiver(user.username);

    }

    useEffect(() => {
        const getMsgs = async () => {
            console.log(authName);
            console.log(chatReceiver);
            const res = await axios.get('http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:8080/msgs', {
                    params: {
                        'sender': authName,
                        'receiver': chatReceiver
                    }
                },
                {
                    withCredentials: true
                })
            console.log(res.data.length);
            if (res.data.length === 0) {
                resetChatMsgs();
            } else {
                newChatMsgs(res.data);
            }
        }
        if (chatReceiver) {
            getMsgs();

        }
    }, [chatReceiver]);

    return (
        <div >
            {users.map((user, index) => (
                <div key={index} onClick={() => setChatReceiver(user)}
                     className={`${chatReceiver === user.username ? 'bg-white' : 'bg-blue-300'} box-content border-x-8 m-1 p-10,}`}>
                    <p className="text-neutral-900 font-mono ">{user.username}</p>
                {/*    <div key={index} onClick={() => setChatReceiver(user)}*/}
                {/*         className="flex items-center p-4 hover:bg-gray-200 cursor-pointer border-b border-gray-300">*/}
                {/*        <div className="flex flex-col flex-grow">*/}
                {/*            <div className="text-sm font-black">{user.name}</div>*/}
                {/*        </div>*/}
                {/*</div>*/}
                </div>
            ))}
        </div>


    )
}


export default ChatUsers;