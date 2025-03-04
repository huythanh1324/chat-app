import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/chatProvide'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import Lottie from 'react-lottie'
import { ArrowBackIcon } from '@chakra-ui/icons'
import {getSender,getSenderFull} from '../../config/ChatLogics.js'
import ProfileModal from './ProfileModal.js'
import UpdateGroupChatModal from './UpdateGroupChatModal.js'
import axios from 'axios'
import './style.css'
import ScrollableChat from '../userAvatar/ScrollableChat.js'
import io from 'socket.io-client'
import animationData from '../../animation/typing.json'

const ENDPOINT = "http://127.0.0.1:5000";
var socket, selectedChatCompare;


const SingleChat = ({fetchAgain ,setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat,notification,setNotification} = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState()
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected,setSocketConnected] = useState(false)
    const [typing,setTyping]= useState(false)
    const [isTyping,setIsTyping] = useState(false)
    const toast = useToast()
    const defaultOptions = {loop:true, autoplay: true, animationData: animationData, rendererSettings: {preserveAspectRatio: "xMidYMid slice"}}

    const fetchMessages = async() => {
        if(!selectedChat) return
        const config = {
            headers:{
                Authorization :`Bear ${user.token}`,
                "Content-type": "application/json"
            }
        }

        setLoading(true)
        
        try{
            const {data} = await axios.get(`http://127.0.0.1:5000/api/message/${selectedChat._id}`,config)
            setMessages(data)
            setLoading(false)
            socket.emit('join chat',selectedChat._id)
        }catch(err){
            setLoading(false)
            console.log(err)
            toast({
                title: "Error occured",
                description: "Fail to fetch all messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
    }

    const sendMessage = async(e)=>{
        if(e.key ==="Enter" && newMessage) {
            socket.emit('stop typing',selectedChat._id)
            try{
                const config = {
                    headers:{
                        Authorization :`Bear ${user.token}`,
                        "Content-type": "application/json"
                    }
                }

                const {data} = await axios.post("http://127.0.0.1:5000/api/message",{
                    content: newMessage,
                    chatId: selectedChat._id
                },config)

                console.log(data)

                socket.emit('new message',data)
                setNewMessage("")
                setMessages([...messages,data])
            }catch(err){
                console.log(err)
                toast({
                    title: "Error occured",
                    description: "Fail to send a message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-left"
                })
            }
        }
    }
    const typingHandler = (e) =>{
        setNewMessage(e.target.value)

        if(!socketConnected) return;

        if(!typing){
            setTyping(true)
            socket.emit('typing',selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(()=>{
            var timeNow =new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if(timeDiff >= timerLength && typing ){
                socket.emit('stop typing',selectedChat._id)
                setTyping(false)
            }
        },timerLength)
    }
    useEffect(()=>{
        socket = io(ENDPOINT)
        socket.emit("setup",user)
        socket.on('connected', ()=>{
            setSocketConnected(true)
        })
        socket.on('typing',() => {
            setIsTyping(true)
        })
        socket.on('stop typing',() => {
            setIsTyping(false)
        })
    },[])

    useEffect(()=>{
        socket.on('message recieved',(newMessageRecieved) =>{
            if(!selectedChatCompare || selectedChatCompare._id === newMessageRecieved.chat._id) {
                if(!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved,...notification])
                    setFetchAgain(!fetchAgain)
                }
            }else{
                setMessages([...messages,newMessageRecieved])
            }
        })

    })

    useEffect(()=>{
        fetchMessages()
        selectedChatCompare = selectedChat
    },[selectedChat])


  return (
    <>
        {selectedChat ? (
            <>
                <Text fontSize={{base: "28px" , md:"30px"}} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex"
                       justifyContent={{base: "space-between"}} alignItems="center">
                    <IconButton display={{base: "flex", md: "none"}} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")}/>
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user,selectedChat.users)}
                            <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                        </>
                    ):(
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} 
                            fetchMessages={fetchMessages}/>
                        </>
                    )} 
                </Text>
                <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#e8e8e8" w="100%" h="100%" 
                    borderRadius="lg" overflowY="hidden" > 
                    {loading? (
                        <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" /> 
                    ) : (
                    <div className='message'>
                        <ScrollableChat messages={messages}/>
                    </div>)}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping? <div><Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0}} /></div>: (<></>)}
                        <Input variant="filled" bg="#e0e0e0" placeholder="Enter a message" onChange={typingHandler} 
                        value={newMessage} /> 
                    </FormControl>
                </Box>
            </>
            ): (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on the user to start chatting
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat