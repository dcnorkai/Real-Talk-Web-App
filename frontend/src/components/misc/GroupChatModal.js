import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { Input } from "@chakra-ui/react";
import { useState } from 'react';
import axios from 'axios';
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    
    const toast = useToast()

    const { user, chats, setChats} = ChatState()

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

    const handleSubmit = async() => {
      if(!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.post("/api/chat/group", {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },config);
        setChats([data,...chats])
        onClose()
        toast({
          title: "Group Chat Created",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Create Chat",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
    const handleDelete = (deletedUser) => {
      setSelectedUsers(selectedUsers.filter((selected)=>selected._id !== deletedUser._id))
    };

    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        toast({
          title: "User Already Added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      setSelectedUsers([...selectedUsers,userToAdd])
    };

    return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="gg sans Medium"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
            </ModalHeader>
          <ModalCloseButton />
          <ModalBody dsiplay="flex" flexDir="column" alignItems="center">
            <FormControl>
                <Input placeholder="Chat Name" mb={3} onChange={(e) => setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
                <Input placeholder="Add Users" mb={1} onChange={(e) => handleSearch(e.target.value)}/>
            </FormControl>
            <Box width="100%" display="flex" flexWrap="wrap">
            {selectedUsers.map(u=>(
              <UserBadgeItem key={user._id} user={u}
              handleFunction={()=>handleDelete(u)}
              />
            ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
