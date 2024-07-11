import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { ChatState } from '../../context/chatProvide'

const Login = () => {
    const [email , setEmail] = useState();
    const [password,setPassword] = useState();
    const [show,setShow] = useState(false);
    const toast = useToast();
    const [loading, setLoading] = useState(false)
    const {setUser,user} = ChatState()
    const navigate = useNavigate()

    const handleOnClick = ()=>{
        setShow(!show)
    }
    const submitHandler = async()=>{
        setLoading(true);
        if(!email || !password){
            toast({
                title: "Please enter email and password",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
        try {
            const config = {
                headers : {
                    "Content-type": "application/json",
                }
            }
            const {data} =await axios.post("http://127.0.0.1:5000/api/user/login",{email,password},config)
            toast({
                title: "Login successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setUser(data)
            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            navigate('/chats')
        }catch(err){
            console.log(err)
            toast({
                title: "Error occured",
                description:err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }
  return (
    <VStack spacing='5px'>
        <FormControl id='email'isRequired>
            <FormLabel>Email (Test: guest@example.com)</FormLabel>
            <Input placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password(Test: 123456)</FormLabel>
            <InputGroup>
                <Input type={show ? 'text' :'password'} placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleOnClick}>
                        {show ? "Hide" :"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup> 
        </FormControl>
        

        <Button colorScheme='blue' width="100%" style={{marginTop: 15}} onClick={submitHandler} isLoading={loading}>Log In</Button>
    </VStack>
  )
}

export default Login