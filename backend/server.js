

const express = require('express');
const connectToDB = require('./config/db.js')
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const chatRouter = require('./routes/chatRoutes.js');
const messageRouter = require('./routes/messageRoutes.js');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectToDB();
const app = express()

app.use(cors())
app.use(express.json())



app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)

// Deployment 
const __dirname1 = path.resolve()
if(process.env.NODE_ENV){
    app.use(express.static(path.join(__dirname1, '/frontend/build')))
    app.get('*',(req,res) =>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
    })
}else {
    app.get('/',(req,res) => {
        res.send("Helloooooo")
    }) 
}

// Deployment 

app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

const server = app.listen(PORT,()=> {
    console.log(`Server is listen at port ${PORT}`)
})

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
        origin: "https://localhost:3000"
    }
})

io.on('connection',(socket)=>{
    console.log('connected to socket.io')
    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log("User Joined Room: " + room)
    })

    socket.on('typing',(room)=>{
        socket.in(room).emit('typing')
    })
    socket.on('stop typing',(room)=>{
        socket.in(room).emit('stop typing')
    })
    socket.on('new message',(newMessageReceived)=> {
        var chat = newMessageReceived.chat

        if(!chat.users){
            console.log('chat.users not defined')
            return
        }

        chat.users.forEach(user =>{
            if(user._id === newMessageReceived.sender._id) return;
            
            socket.in(user._id).emit("message recieved", newMessageReceived)
        })
    })
    socket.off("setup" ,()=>{
        console.log("User disconnected")
        socket.leave(userData._id)
    })
})

