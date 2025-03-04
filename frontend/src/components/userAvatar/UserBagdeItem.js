import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBagdeItem = ({user, handleFunction}) => {
  return (
    <Box px={2} py={1} borderRadius="lg" m={1} mb={2} variant="solid" fontSize={12} backgroundColor="orange" cursor="pointer" onClick={handleFunction} color='white'>
        {user.name} <CloseIcon />
    </Box>
  )
}

export default UserBagdeItem