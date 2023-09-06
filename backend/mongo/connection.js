const mongoose = require("mongoose");


let mongoRelated = {
    connection: function () {

        mongoose.connect("mongodb://127.0.0.1/user_management").then(() => {
            console.log('connected to mongodb');
        }).catch((err) => {
            console.error("Connection ERROR FOUND");
        })
    }
}


module.exports = mongoRelated;