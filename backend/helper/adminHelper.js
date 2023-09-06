
const { default: mongoose } = require("mongoose")
const Admin = require("../mongo/model/adminModel")
const User = require("../mongo/model/user_model")

const adminHelper = {
    adminLogin: function (username, password) {
        return new Promise((resolve, reject) => {
            Admin.findOne({ username: username, password: password }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },


    getAllUser: function () {
        return new Promise((resolve, reject) => {

            User.find({}).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    findUser: function (userid) {
        return new Promise((resolve, reject) => {

            User.findOne({ _id: new mongoose.Types.ObjectId(userid) }).then((data) => {

                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },


     

    updateUser: function (user, newUser) {
        return new Promise((resolve, reject) => {
            User.updateOne(
                {
                    _id: new mongoose.Types.ObjectId(user)
                },
                {
                    $set: newUser
                }
            ).then((data) => {
                console.log("Update data", data);
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },


    deleteUser: (user_id) => {
        console.log("Prime Delete ", user_id)
        return new Promise((resolve, reject) => {
            User.deleteOne(
                {
                    _id: new mongoose.Types.ObjectId(user_id)
                }
            ).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    } 

}


module.exports = adminHelper