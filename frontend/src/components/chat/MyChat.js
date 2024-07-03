import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/chatProvide'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading.js'
import {getSender} from '../../config/ChatLogics.js'
import GroupChatModal from './GroupChatModal.js'

const MyChat = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser] = useState()
  const {selectedChat,setSelectedChat, user, chats,setChats, setUser} = ChatState()
  const toast = useToast();
  
  const fetchChats = async() =>{
    if(!user) {
      console.log(user)
      setUser(JSON.parse(localStorage.getItem("userInfo")))
    };
    
    try{
      const config = {
        headers: {
          Authorization: `Bear ${user.token}`
        }
      };
      const {data} = await axios.get('http://localhost:5000/api/chat',config)
      setChats(data)
    }catch(err){
      console.log(err)
      toast({
        title: "Error occured",
        description: "Fail to load the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats()
  },[fetchAgain])
  return (
    <Box display={{base: selectedChat? "none" : "flex" , md:"flex"}} flexDir="column" alignItems="center" p={3}
          bg="white" w={{base: "100%", md:"30%"}} borderRadius="lg" borderWidth="1px" >
      <Box pb={3} px={3} fontSize={{base: "28px", md:"30px"}} fontFamily="Work sans" display="flex" w="100%" 
          justifyContent="space-between" alignItems="center" >
            My Chats
            <GroupChatModal>
              <Button display="flex" fontSize={{base : "17px" , md:'10px' , lg:"17px"}} rightIcon={<AddIcon />}>
                New group chat
              </Button>
            </GroupChatModal>
      </Box>
      <Box display='flex' flexDir="column" p={3} bg="#f8f8f8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        {chats && loggedUser ? (
          <Stack overflowY="scroll">
            {chats.map((chat)=>{
              return(
              <Box onClick={()=>setSelectedChat(chat)} cursor="pointer" bg={selectedChat===chat ? "#38B2AC" : "#e8e8e8"}
                color={selectedChat === chat ? "white": "black"} px={3} py={2} borderRadius="lg" key={chat._id}>
                  <Text>
                    {!chat.isGroupChat?getSender(loggedUser, chat.users):chat.chatName}
                  </Text>
              </Box>
              )
            })}
          </Stack>
        ):(
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChat