import React from 'react'
import {ChatState} from '../../context/chatProvide.js'
import {Box} from '@chakra-ui/react'
import SingleChat from './SingleChat.js'

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState()

  return (
    <Box display={{base: selectedChat ? "flex" : "none", md: "flex"}} alignItems="center" flexDir="column" p={3}
         bg="white" w={{base: "100%",md: "58%"}} borderRadius="lg" borderWidth="1px">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox