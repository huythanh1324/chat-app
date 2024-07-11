import React, { useState } from 'react'
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, position, useHighlight, useToast} from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [name,setName] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [show,setShow] = useState(false)
    const [confirmPassword,setConfirmPassword] = useState()
    const [pic,setPic] = useState()
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const handleOnClick = ()=>{
        setShow(!show)
    }

    const postDetails = (pics)=>{
        setLoading(true)
        if(pics===undefined){
            toast({
                title: "Please select an image",
                status: "warining",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
        if(pics.type === "image/jpeg" || pics.type ==="image/png"){
            const data = new FormData();
            data.append("file",pics)
            data.append("upload_preset","chat-app")
            data.append("cloud_name","dg7ybvt1b")

            fetch("https://api.cloudinary.com/v1_1/dg7ybvt1b/image/upload",{
                method: "post",
                body: data,
            }).then(res => res.json())
            .then(data => {
                setPic(data.url.toString())
                setLoading(false)
            }).catch(err =>{
                console.log(err)
                setLoading(false)
            })

        } else{
            toast({
                title: "Please select an image",
                status: "warining",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
    }

    const submitHandler = async () =>{
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: "Please fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            })
            setLoading(false)
            return;
        }

        try{
            const config = {
                headers: {
                    "Content-type":"application/json",
                },
            }
            const {data} = await axios.post('https://chap-app-otxn.onrender.com/api/user/register',{name,email,password,pic}, config)
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false);
            // navigate('/chats')
        }catch(err){
            console.log(err)
            toast({
                title: "Error occured!",
                description: err.response.data.message,
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
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter your name' onChange={(e) => setName(e.target.value)}/>
        </FormControl>
        <FormControl id='email'isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? 'text' :'password'} placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleOnClick}>
                        {show ? "Hide" :"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup> 
        </FormControl>
        <FormControl id='confirmPassword' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show ? 'text' :'password'} placeholder='Confirm password' onChange={(e) => setConfirmPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleOnClick}>
                        {show ? "Hide" :"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup> 
        </FormControl>
        <FormControl>
            <FormLabel>Upload your picture</FormLabel>
            <Input type="file"p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])}></Input>
        </FormControl>

        <Button colorScheme='blue' width="100%" style={{marginTop: 15}} onClick={submitHandler} isLoading={loading}>Sign Up</Button>
    </VStack>
  )
}

export default Signup