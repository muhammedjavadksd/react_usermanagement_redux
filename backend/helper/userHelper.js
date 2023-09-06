const { default: mongoose } = require("mongoose");
const User = require("../mongo/model/user_model")


const userHelper = {
    loginUser: function (username, password) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: username, password: password }).then((data) => {
                console.log("My data", data);
                if (!data) {
                    resolve(null);
                }
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        });
    },

    updateUserProfile: function (userid, filename) {
        return new Promise((resolve, reject) => {
            User.updateOne(
                {
                    _id: new mongoose.Types.ObjectId(userid)
                },
                {
                    $set: {
                        profile: filename
                    }
                }
            ).then(() => resolve())
                .catch((err) => {
                    reject(err.message)
                })
        })
    }
}

module.exports = userHelper;