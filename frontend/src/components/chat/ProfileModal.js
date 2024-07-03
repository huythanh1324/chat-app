import { ViewIcon } from '@chakra-ui/icons'
import { Avatar, Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user,children}) => {
    const {isOpen,onOpen,onClose} = useDisclosure()
    console.log(user.pic)
    
  return (
    <>
        {children? (<span onClick={onOpen}>{children}</span>) : (<IconButton d={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} />)}

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h='400px'>
                <ModalHeader
                    fontSize='40px' 
                    fontFamily='Work sans'
                    display='flex'
                    justifyContent="center"
                >
                    {user.name}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
                    {/* <Image 
                        borderRadius="full"
                        boxSize="150px"
                        scr={user.pic}
                        alt={user.name}
                    /> */}
                    <Avatar size='2xl' name={user.name} src={user.pic}/>

                    <Text fontSize={{base: "28px",md: "30px"}}>Email: {user.email}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default ProfileModal