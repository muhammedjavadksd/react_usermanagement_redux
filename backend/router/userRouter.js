const express = require("express");
const router = express.Router();
let fileHelper = require("../helper/file_helper");
let path = require("path")
let UserModel = require("../mongo/model/user_model");
let userHelper = require("../helper/userHelper");
const { default: mongoose } = require("mongoose");
const { log } = require("console");


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
            res.send({ status: false, error:  "ERROR: Related to Registration" })
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
            res.send({ status: true, user: data })
        } else {

            res.status(200).send({ status: false, error: "Invalid username and password" })
        }
    }).catch((err) => {
        res.send({ status: false, error: "Something Error" + err })
    })
})


router.post("/profile_picture_update", async (req, res) => {


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