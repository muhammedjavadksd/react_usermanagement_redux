
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


    findAdminByToken: (tokenID) => {
        return new Promise((resolve, reject) => {
            Admin.findById(tokenID).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },


    updateAdmin: function (adminID, data) {
        return new Promise((res, rej) => {

            Admin.findByIdAndUpdate(adminID, data).then((data) => {
                if (data) res(data);
                else rej();
            }).catch((err) => {
                rej(err)
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