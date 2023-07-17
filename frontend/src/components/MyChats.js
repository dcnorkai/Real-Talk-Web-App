import React from 'react'
import {ChatState} from "../Context/ChatProvider"
import axios from 'axios';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState()
    const {selectedChat,setSelectedChat,user,chats,setChats} = ChatState()

    const toast = useToast()

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.get("/api/chat", config)
            setChats(data)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to Load Chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return <div>My Chats</div>
}

export default MyChats;