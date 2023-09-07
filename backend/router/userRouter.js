const express = require("express");
const router = express.Router();
let fileHelper = require("../helper/file_helper");
let path = require("path")
let UserModel = require("../mongo/model/user_model");
let userHelper = require("../helper/userHelper");
const { default: mongoose } = require("mongoose");
const { log } = require("console");
let tokenHelper = require("../helper/token")
let const_data = require("../const/const")
let jwt = require("jsonwebtoken")




function jwtValidation(req, res, next) {
    let header = req.header("Authorization");

    if (header) {
        const token = header.split(" ")[1];
        try {
            jwt.verify(token, const_data.SECRET_CODE, (err, data) => {
                if (!err) next()
                else res.status(401).send({ status: false, msg: "Do not have valid auth" })
            })
        } catch (e) {
            res.status(401).send({ status: false, msg: "Do not have valid auth" })
        }
    } else {
        res.status(401).send({ status: false, msg: "Do not have valid auth" })
    }
}




router.get("/refresh_token", (req, res) => {

    let tokenID = req.query.refresh_reference;
    console.log("Token IS", tokenID)


    userHelper.findUser(tokenID).then((user) => {

        if (user) {
            let accessToken = tokenHelper.primtGenerateToken({ "username": user.username });
            let refreshToken = tokenHelper.SecondryGenerateToken({ "username_cred": user.username });

            const updateData = {
                refreshToken
            }

            userHelper.updateUser(user._id, updateData).then((dt) => {
                res.send({
                    status: true, user: user, refresh_reference: dt._id,
                    access_token: accessToken
                })
            }).catch((err) => {
                console.log(err)
                res.send({ status: false, error: "Updation Issue", msg: err })
            })
        } else {
            console.log("Hi")
            res.status(401).json({ status: false, msg: "Do not have auth" })
        }
    }).catch((err) => {
        console.log("This error", err)
        res.status(401).json({ status: false, msg: "Do not have auth 1" })
    }
    )
})


router.get("/validate_jwt", async (req, res) => {
    const token = req.query.access_token;
    const refresh_token = req.query.refresh_reference;

    try {
        if (!token) {
            res.status(401).json({ status: false, msg: "Do not have auth (Token) " });
        } else {
            const user = await userHelper.findUser(refresh_token);
            if (user) {
                jwt.verify(token, const_data.SECRET_CODE, (err, data) => {
                    if (err) {
                        res.status(403).json({ status: false, msg: "You don't have auth (Not Verified) " });
                    } else {
                        console.log("This be work ")
                        res.json({ status: true, user, token: req.query.access_token });
                    }
                });
            } else {
                res.status(401).json({ status: false, msg: "You don't have auth (No user)" });
            }
        }
    } catch (e) {
        res.status(401).json({ status: false, msg: "You don't have auth" });
    }
});



router.post("/user_registration", async (req, res) => {

    let file = req.files?.profile
    let fileName = "user_profile_" + file?.name


    let userData = {
        name: req.body.name,
        username: req.body.username,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        profile: fileName
    }



    let pathto = path.join(__dirname, "../public/user_profile/" + fileName);

    fileHelper.moveFileUpload(pathto, file).then((mv) => {
        let user = new UserModel(userData)
        user.save().then((data) => {
            res.send({ status: true, user: data })
        }).catch((err) => {
            res.send({ status: false, error: "ERROR: Related to Registration" })
        })
    }).catch((err) => {
        res.send({ status: false, error: "ERROR: Related to Image" })
    })


})



router.post("/user_login", (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    userHelper.loginUser(username, password).then((data) => {

        if (data) {

            let accessToken = tokenHelper.primtGenerateToken({ username: data.username })
            let refresh_token = tokenHelper.SecondryGenerateToken({ name: data.name })

            let updateData = {
                refresh_token: refresh_token
            }

            userHelper.updateUser(data._id, updateData).then((newUser) => {
                res.send({ status: true, user: data, accessToken, refresh_token: data._id })
            }).catch((err) => {
                res.status(401).send({ status: false, error: "Token Failur" })
            })
        } else {
            res.status(401).send({ status: false, error: "Invalid username and password" })
        }
    }).catch((err) => {
        res.send({ status: false, error: "Something Error" + err })
    })
})


router.post("/profile_picture_update", jwtValidation, async (req, res) => {


    let user = req.body.user;

    let file = req.files?.profile

    let fileName = "user_profile_" + file?.name
    let pathto = path.join(__dirname, "../public/user_profile/" + fileName);


    fileHelper.moveFileUpload(pathto, file).then(() => {

        userHelper.updateUserProfile(user, fileName).then(() => {
            res.send({ status: true, profile: fileName })
        }).catch((err) => {
            res.send({ status: false, error: err })
        })
    }).catch((err) => {
        res.send({ status: false, error: err })
    })

})


module.exports = router