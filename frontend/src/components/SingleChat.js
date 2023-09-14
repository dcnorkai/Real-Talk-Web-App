import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, effect } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './misc/ProfileModal';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import { useState } from 'react';
import { Spinner, FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect } from 'react';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000";
var socket;
var selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const toast = useToast()

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const {user,selectedChat,setSelectedChat} = ChatState()
    const [socketConnected, setSocketConnected] = useState(false)

    const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  console.log(messages)

  useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connection", () => setSocketConnected(true))
    }, [])  

  useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

  useEffect(() => {
        socket.on("message recieved",(newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {

            } else {
                setMessages([...messages],newMessageRecieved)
            }
        })
    })

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

    const typingHandler = (e) => {
        setNewMessage(e.target.value)


    }

    return (
        <>
            {selectedChat ? (
                <>
                <Text
                fontSize={{base: "28px", md: "30px"}}
                pb={3}
                px={2}
                width="100%"
                fontFamily="gg sans Medium"
                display="flex"
                justifyContent={{base: "space-between"}}
                alignItems="center"
                >
                <IconButton d={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")}
                />
                {!selectedChat.isGroupChat ? (
                    <>
                        {getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                    </>
                ) : (
                    <>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal 
                        fetchAgain={fetchAgain} 
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                        />
                    </>
                )}
                </Text>
                <Box
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                bg="#E8E8E8"
                width="100%"
                height="100%"
                borderRadius="lg"
                overflowY="hidden"
                >
                    {loading? (
                        <Spinner
                            size="xl"
                            width={20}
                            height={20}
                            alignSelf="center"
                            margin="auto"
                        />
                    ) : (
                        <div className="messages">
                            <ScrollableChat messages={messages}/>
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input variant="filled" bg= "#E0E0E0" placeholder="Message" onChange={typingHandler} value={newMessage} />
                    </FormControl>
                </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="gg sans Medium">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat
