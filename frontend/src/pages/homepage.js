import React from "react";
import {Container,Box,Text,Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Login from "../components/authentication/Login"
import Signup from "../components/authentication/Signup";
import { useHistory } from "react-router-dom"
import { useEffect } from "react";

const Homepage = () => {

    const history = useHistory()

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"))

        if (user) history.push("/chats")
    }, [history]);

    return <Container maxW='xl' centerContent>
        <Box
        d='flex'
        justifyContent="center"
        textAlign="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        >
            <Text fontSize="4xl" fontFamily="gg sans Medium" color="black">Real Talk</Text>
        </Box>
        <Box bg='white' w='100%' p={4} borderRadius="lg" borderWidth="1px">
            <Tabs isFitted variant='enclosed'>
            <TabList mb='1em'>
                <Tab>Login</Tab>
                <Tab>Sign up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                <Login />
                </TabPanel>
                <TabPanel>
                <Signup />
                </TabPanel>
            </TabPanels>
            </Tabs>
        </Box>
    </Container>;
};

export default Homepage;