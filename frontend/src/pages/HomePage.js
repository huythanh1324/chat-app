import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/auth/Login'
import Signup from '../components/auth/Signup'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if (user) navigate('/chats')
  },[])
  return (
    <Container maxW='xl' centerContent>
      <Box display="flex" justifyContent="center" p={3} bg="white" w="100%" m="40px 0" borderRadius="lg" borderWidth="1px">
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          Chat App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth='1px'>
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign up</Tab>
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
    </Container>
  )
}

export default HomePage