import React, { useState } from 'react'
import {ChatState} from '../../context/chatProvide.js'
import UserListItem from '../userAvatar/UserListItem.js'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from '@chakra-ui/react'
import axios from 'axios'
import UserBagdeItem from '../userAvatar/UserBagdeItem.js'

const GroupChatModal = ({children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName,setGroupChatName] = useState()
  const [selectedUsers,setSelectedUsers] = useState([])
  const [search,setSearch] = useState()
  const [searchResults,setSearchResults] = useState()
  const [loading,setLoading] = useState()
  const toast = useToast()
  const {user,chats,setChats} = ChatState()
  

  const handleSearch = async(query) =>{
    setSearch(query);
    if(!query){
      return;
    }
    try{
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bear ${user.token}`
        }
      }

      const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
      console.log(data)
      setLoading(false)
      setSearchResults(data)
    }catch(err){
      console.log(err)
      toast({
        title: "Error occured",
        description: "Fail to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
    }
  }

  const handleSubmit = async() =>{
    if (!groupChatName || !selectedUsers){
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position:"top-left" 
      })
      return;
    }

    try{
      const config= {
        headers: {
          Authorization: `Bear ${user.token}`
        }
      }
      const {data} = await axios.post("http://localhost:5000/api/chat/group",{
        name: groupChatName, 
        users:JSON.stringify(selectedUsers.map(user=>user._id))
      },config)
      setChats([data,...chats])
      onClose();
      toast({
        title: 'New Group Chat Created',
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
    }catch(err){
      console.log(err)
      toast({
        title: 'Fail to create new group chat',
        status: "error",
        description: err.response.data,
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
    }

  }
  const handleGroup = (userAdd) =>{
    if(selectedUsers.includes(userAdd)){
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top"
      })
      return;
    }
    setSelectedUsers([...selectedUsers,userAdd])
  }

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter(user=> user._id !== delUser._id))
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center" >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="space-between" alignItems="center" flexDirection="column">
            <FormControl>
              <Input placeholder="Chat name" mb={3} onChange={(e)=> setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
              <Input placeholder="Add User eg: Thanh, Quynh,..." mb={1} onChange={(e)=> handleSearch(e.target.value)}/>
            </FormControl>
            <Box display='flex' w="100%" flexWrap="wrap">
              {selectedUsers?.map(user => {
                return <UserBagdeItem key={user._id} user={user} handleFunction={() => handleDelete(user)}/>
              })}
            </Box>

            {loading ? <div>Loading</div> : (
              searchResults?.slice(0,4).map(user => {
                return <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
              }) 
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal