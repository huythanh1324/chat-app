const expressAsyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../models/userModel");

const accessChat = expressAsyncHandler(async(req,res) => {
    const {userId} = req.body;
    
    if(!userId){
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate('users','-password').populate('lastestMessage')

    isChat = await User.populate(isChat,{
        path: 'latestMessage.sender',
        select: 'name pic email'
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id,userId]
        }

        try{
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({_id: createdChat._id}).populate('users','-password')
            res.status(200).send(fullChat)
        }catch(err){
            console.log(err)
            res.status(400)
            throw new Error(err.message)
        }
    }
});

const fetchChat = expressAsyncHandler(async(req,res) => {
    try{
        Chat.find({users :{$elemMatch: {$eq: req.user._id}}})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("lastestMessage")
            .sort({updatedAt: -1})
            .then( async(results) =>{
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                })

                res.status(200).send(results)
            })
    }catch(err){
        res.status(400);
        throw new Error(err.message)
    }
})

const createGroupChat = expressAsyncHandler(async(req,res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({messgae: "Please fill all the fields"})
    }

    var users = JSON.parse(req.body.users)

    if(users.length < 2){
        return res.status(400).send("A group must be more than 2 users")
    }

    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin : req.user,
        })

        const fullGroupChat = await Chat.findOne({_id : groupChat._id})
                                        .populate("users","-password")
                                        .populate("groupAdmin","-password")
        
        res.status(200).json(fullGroupChat)
    }catch(err){
        console.log(err)
        res.status(400)
        throw new Error(err.message)
    }
})

const renameGroup = expressAsyncHandler(async(req,res)=>{
    const {chatId, chatName} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {chatName},
        {new:true}
    ).populate("users","-password").populate("groupAdmin","-password")
    console.log()
    if(!updatedChat){
        res.status(404);
        throw new Error("Chat Not Found")
    }else{
        res.json(updatedChat)
    }

})

const addToGroup = expressAsyncHandler(async(req,res) =>{
    const {chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {$push: {users:userId}},
        {new: true}
    ).populate("users","-password").populate("groupAdmin","-password")

    if(!added){
        res.status(404)
        throw new Error("Chat Not Found")
    }else{
        res.json(added)
    }

})

const removeFromGroup = expressAsyncHandler(async(req,res) =>{
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {$pull: {users: userId}},
        {new:true}
    ).populate("users","-password").populate("groupAdmin","-password")

    if(!removed){
        res.status(404)
        throw new Error("Chat not found")
    }else{
        res.json(removed)
    }
})

module.exports = {accessChat ,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup}