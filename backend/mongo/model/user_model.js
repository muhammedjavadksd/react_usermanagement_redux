const mongoose= require("mongoose")


let model = new mongoose.Schema({
    name:{
        type:String, 
    },
    username:{
        type:String, 
    },
    phone:{
        type:String, 
    },
    email:{
        type:String, 
    },
    password:{
        type:String
    },
    profile:{
        type:String, 
    } 
})

let user= mongoose.model("User",model,"user") 
module.exports= user;