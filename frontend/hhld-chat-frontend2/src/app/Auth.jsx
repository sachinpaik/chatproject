"use client"
import {useEffect, useState} from 'react';
import React from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation'
import {useAuthStore} from "@/app/zustand/useAuthStore";
import {getUserData} from "@/app/Chat/page";

function Auth() {
    const router = useRouter()
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const {authName,updateAuthName} = useAuthStore();
    const asynSingup = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:80/auth/signup',
                {
                    username: username,
                    password: password
                      },
                {
                    withCredentials: true
                }
            );
            if (res.data.message === "Username already exists") {
                alert("Username already exist");
            } else {
                updateAuthName(username);
                router.replace('/Chat');
            }
        } catch (exception) {
            console.log("Error in signup function : ", exception.message)

        }
    }
    const asynSingin = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://hhld-chat-1924609593.us-east-1.elb.amazonaws.com:80/auth/login', {
                    username: username,
                    password: password
                }
                ,
                {
                    withCredentials: true
                });
            updateAuthName(username);
            router.replace('/Chat');
        } catch (exception) {
            console.log("Error in login function : ", exception.message);

        }
    }

    useEffect(() => {
        const getData = async () => {
            return await getUserData();
        };
        getData().then((response)=>{
            if(response.status===200){
                router.push('/Chat');
            }}).catch((error)=>{
            console.log("login required");
        });

    }, []);
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                         alt="logo"/>
                    MyChat
                </a>
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label form="username"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User
                                    Name</label>
                                <input type="text"
                                       name="username"
                                       id="username"
                                       value={username}
                                       onChange={event => setUserName(event.target.value)}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       required=""/>
                            </div>
                            <div>
                                <label form="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password"
                                       name="password"
                                       id="password"
                                       value={password}
                                       onChange={event => {
                                           setPassword(event.target.value)
                                       }}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       required=""/>
                            </div>
                            <div className="flex">
                                <button type="submit"
                                        onClick={asynSingin}
                                        className="flex m-2 w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                                    in
                                </button>
                                <button type="submit"
                                        onClick={asynSingup}
                                        className="flex m-2 w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                                    up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Auth;