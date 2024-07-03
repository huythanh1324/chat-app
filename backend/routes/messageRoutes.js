const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { sendMessage, allMessage } = require('../controllers/messageController')

const messageRouter = express.Router()

messageRouter.get('/:chatId',protect,allMessage)
messageRouter.post('/',protect,sendMessage)

module.exports = messageRouter