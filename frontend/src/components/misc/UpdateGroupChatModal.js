import { useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { Spinner, FormControl, Input, Box, useToast, IconButton, Modal, Button, ModalFooter, ModalCloseButton, ModalOverlay, ModalHeader, ModalContent, ModalBody } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import { useState } from 'react';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const {isOpen,onOpen,onClose} = useDisclosure();
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false)
    const {selectedChat, setSelectedChat, user} = ChatState();
    const toast = useToast();
    const handleRemove = async(user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only Admins can Remove Someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const {data} = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            )
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            fetchMessages();
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
        }
    };
    const handleAddUser = async(user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)){
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return
        }

        if(selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admins can Add Someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id,
            },config);
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
        }
    };
    const handleRename = async() => {
        if(!groupChatName) return
        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const {data} = await axios.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName:groupChatName,
            },
            config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };
    const handleSearch = async (query) => {
      if (!query) {
        // If the query is empty, reset the search results
        setSearchResult([]);
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${query}`, config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
    return (
    <>
      <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="gg sans Medium"
            display="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map(u => (
                    <UserBadgeItem key={user._id} user={u}
                    handleFunction={()=>handleRemove(u)}
                    />
                ))}
            </Box>
            <FormControl display="flex">
                <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)}/>
                <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>
                    Update
                </Button>
            </FormControl>
            <FormControl>
                <Input placeholder="Add a User to the Group" mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            {loading ? (
                <Spinner size="lg" />
            ) : (
                searchResult?.map((user) => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
