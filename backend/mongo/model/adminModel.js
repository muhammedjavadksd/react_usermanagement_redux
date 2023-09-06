const mongoose = require("mongoose")


let model = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    }
})

let admin = mongoose.model("Admin", model, "admin")
module.exports = admin;