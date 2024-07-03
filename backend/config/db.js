const mongoose = require('mongoose')

const connectToDB = async() =>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI,{});
        console.log("DB connected")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectToDB


