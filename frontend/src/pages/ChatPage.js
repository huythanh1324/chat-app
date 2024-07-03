import React, { useState } from 'react'
import axios from 'axios'
import { ChatState } from '../context/chatProvide';
import {Box} from '@chakra-ui/react'
import SideDrawer from "../components/chat/SideDrawer.js"
import MyChat from "../components/chat/MyChat.js"
import ChatBox from "../components/chat/ChatBox.js"

const ChatPage = () => {
    const {user} = ChatState();
    const [fetchAgain,setFetchAgain] = useState(false)
  return (
    <div style ={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display='flex' w="100%" h="90vh" p='10px'>
        {user && <MyChat fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage