import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Toast, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import React, { useState } from 'react'
import { ChatState } from '../../context/chatProvide'
import ProfileModal from './ProfileModal'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics'
import {Effect} from 'react-notification-badge'
import Notification from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge'

const SideDrawer = () => {
  const [search,setSearch] = useState("")
  const [searchResult,setSearchResult] = useState([])
  const [loading,setLoading] = useState(false)
  const [loadingChat,setLoadingChat] = useState("")
  const {user,setSelectedChat, chats,setChats,notification,setNotification} = ChatState();
  const {isOpen, onOpen,onClose} = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  
  const logoutHandler = () =>{
    localStorage.removeItem("userInfo")
    navigate('/')
  }
  const handleSearch = async() =>{
    if(!search){
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return;
    }
    try{
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bear ${user.token}`
        }
      }

      const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`, config)
      setLoading(false)
      setSearchResult(data)
    }catch(err){
      console.log(err)
      toast({
        title: "Error occured",
        description: "Failed to load search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
    }
  }
  const accessChat = async(userId) =>{
    console.log(user)
    try{
      setLoadingChat(true) 
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bear ${user.token}`
        }
      }

      const {data} = await axios.post('http://localhost:5000/api/chat', {userId}, config)
      if(!chats.find((chat) => chat._id === data._id)) setChats(prev => [...prev,data])
      setSelectedChat(data)
      setLoading(false) 
      onClose();
    } catch(err){
      setLoadingChat(false) 
      console.log(err)
      toast({
        title: "Error fetching the chat box",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })

    }
  }
  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px" borderWidth="5px">
      <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
        <Button variant="ghost" onClick={onOpen}>
          <i className="fas fa-search"></i>
          <Text d={{base:"none",md:"flex"}} px={4}>
            Search Users
          </Text>
        </Button>
      </Tooltip>

      <Text fontSize="2xl" fontFamily="Work sans">
        Chat-App
      </Text>

      <div>
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
              count = {notification.length}
              effect = {Effect.SCALE}
            />
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((noti) =>{
              return (
                <MenuItem key={noti._id} onClick={()=> {
                                                        setSelectedChat(noti.chat)
                                                        setNotification(notification.filter((n) => n !== noti))
                                                        }}>
                  {noti.chat.isGroupChat 
                  ? `New Message in ${noti.chat.chatName}`
                  :`New Message from ${getSender(user,noti.chat.users)}}`}
                </MenuItem>
              )
            })}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size='sm' cursor="pointer" name={user.name} src={user.pic}/>
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider   />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
        <DrawerBody>
          <Box display="flex" pb={2}>
              <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => {setSearch(e.target.value)}}/>
              <Button onClick= {handleSearch}> Go </Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ):(
            searchResult.map(user =>{
              return <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>
            })
          )}
          {loadingChat && <Spinner ml='auto' display='flex' />}
        </DrawerBody>
      </DrawerContent>  
      
    </Drawer>
    </>
  )
}

export default SideDrawer