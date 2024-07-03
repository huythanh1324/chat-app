const expressAsyncHandler = require("express-async-handler");
const Message = require('../models/messageModel.js');
const User = require("../models/userModel.js");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async(req,res) =>{
    console.log("hello")
    const {content , chatId} = req.body

    if(!content || !chatId ){
        console.log("Invalid data passed into request")
        return res.sendStatus(404)
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try{
        var message = await Message.create(newMessage);

        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path: 'chat.users',
            select: 'name pic email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            lastestMessage:message
        })
        res.json(message)
    }catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})

const allMessage = expressAsyncHandler(async(req,res) => {
    try{
        const messages = await Message.find({chat: req.params.chatId}).populate("sender","name pic email")
        res.json(messages)
    }catch(err) {
        res.status(400)
        throw new Error(err.message)
    }
})

module.exports= {sendMessage,allMessage}