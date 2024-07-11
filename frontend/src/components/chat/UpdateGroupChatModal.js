import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/chatProvide'
import UserBagdeItem from '../userAvatar/UserBagdeItem'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName,setGroupChatName] = useState("")
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] =useState([])
  const [loading,setLoading] = useState(false)
  const {selectedChat, setSelectedChat,user} = ChatState()
  const [renameLoading, setRenameLoading] = useState(false)  
  const toast = useToast()

  const handleRemove = async(userToDel) =>{
    if(selectedChat.groupAdmin._id !== user._id && userToDel._id !== user._id){
      toast({
        title: "Only admins can add someone",
        status: "warning",
        isClosable:true,
        duration:5000,
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
      const {data} = await axios.put("http://127.0.0.1:5000/api/chat/groupremove",{
        chatId: selectedChat._id,
        userId: userToDel._id
      },config)
      console.log(data)
      userToDel._id === user._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
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

  const handleRename = async() =>{
    if(!groupChatName) return

    try{
      setRenameLoading(true) 
      const config = {
        headers : {
          Authorization: `Bear ${user.token}`
        }
      }
      const {data} = await axios.put(`http://127.0.0.1:5000/api/chat/rename`,{
        chatId: selectedChat._id,
        chatName: groupChatName,
      },config)
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false) 
    } catch(err) {
      console.log(err) 
      toast({
        title: "Error occured",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      setRenameLoading(false) 
      
    }
    setGroupChatName("")
  }

  const handleSearch = async(value) =>{
    setSearch(value)
    if(!value){
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
      const {data} = await axios.get(`http://127.0.0.1:5000/api/user?search=${search}`, config)
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
  const handleAddUser = async(userToAdd) =>{
    if (selectedChat.users.find(user => user._id === userToAdd._id)){
      toast({
        title: "USer already in group chat",
        status: "warning",
        isClosable: true,
        duration: 5000,
        position: "top-left"
      })
      return;
    }

    if(selectedChat.groupAdmin._id !== user._id){
      toast({
        title: "Only admins can add someone",
        status: "warning",
        isClosable:true,
        duration:5000,
        position: "top-left"
      })
      return;
    }

    try{
      setLoading(true)
      const config={
        headers: {
          Authorization: `Bear ${user.token}`
        }
      }
      const {data} = await axios.put("http://127.0.0.1:5000/api/chat/groupadd",{
        chatId: selectedChat._id,
        userId: userToAdd._id
      },config)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    }catch(err){
      console.log(err)
      toast({
        title: "Error occured",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      setLoading(false)
    }
  }
  return (
    <div>
      <>
      <IconButton onClick={onOpen} icon={<ViewIcon />}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center"> 
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" pb={3}>
              {selectedChat?.users.map( user => {
                return <UserBagdeItem key={user._id} user={user} handleFunction={()=>handleRemove(user)} />
              }
              )}
            </Box>
            <FormControl display="flex">
              <Input placeholder='Chat name' mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)} />
              <Button variant="solid" colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
            </FormControl>
            <FormControl display="flex">
              <Input placeholder='Add user to group' mb={3} onChange={(e)=>handleSearch(e.target.value)} />
            </FormControl>
            {loading ? (
            <Spinner size="lg" />
          ):(
            searchResult.map(user =>{
              return <UserListItem key={user._id} user={user} handleFunction={(e)=>handleAddUser(user)}/>
            })
          )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    </div>
  )
}

export default UpdateGroupChatModal