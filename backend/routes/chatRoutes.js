const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChat, createGroupChat, renameGroup,addToGroup,removeFromGroup } = require('../controllers/chatController');


const chatRouter = express.Router()

chatRouter.post('/group',protect,createGroupChat)
chatRouter.put('/rename',protect,renameGroup)
chatRouter.put('/groupremove',protect,removeFromGroup)
chatRouter.put('/groupadd',protect,addToGroup)
chatRouter.post('/',protect,accessChat)
chatRouter.get('/',protect,fetchChat)




module.exports= chatRouter;
