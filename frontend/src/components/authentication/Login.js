import React, {useState} from 'react'
import { VStack } from '@chakra-ui/react'
import {FormControl, FormLabel} from "@chakra-ui/form-control"
import {Input} from "@chakra-ui/input"
import { InputGroup, Button, InputRightElement } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'


const Login = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const togglePassword = () => setShow(!show)
    const submitHandler = async() =>{
        if(!email && !password) {
            toast({
                title: "Please enter your Email and Password",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
            return;
        } else if(!email) {
            toast({
                title: "Please Fill in your Email",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
            return;
        } else if (!password) {
            toast({
                title: "Please Fill in your Password",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
            return;
        }
        try {
            const config = { 
                headers: {
                    "Content-type": "application/json",
                },
            }
            const {data} = await axios.post(
                "/api/user/login",
                { email, password},
                config
            )

            toast({
                title: "Login Successful (Might need to refresh the page)",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false);
            history.push("/chats");
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    }

  return (
    <VStack spacing='5px'>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            value = {email}
            placeholder='Enter Your Email'
            onChange={(e)=> setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input
            type={show ? "text" : "password"}
            placeholder='Enter Your Password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={togglePassword}>
                {show ? "Hide" : "Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>
    <Button 
        colorScheme='blue'
        width="100%"
        style={{marginTop: 15}}
        onClick={submitHandler}
        isLoading={loading}
    >
        Login
    </Button>
    </VStack>
  )
}

export default Login
