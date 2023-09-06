

const express = require("express");
const router = express.Router();
let fileHelper = require("../helper/file_helper");
let path = require("path")
let UserModel = require("../mongo/model/user_model");
let userHelper = require("../helper/userHelper");
let adminHelper = require("../helper/adminHelper");
const { default: mongoose } = require("mongoose");


router.post("/admin_login", async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    adminHelper.adminLogin(username, password).then((data) => {
        if (data) {
            res.send({ status: true, admin: data })
        } else {
            res.send({ status: false, error: "Invalid username and password" })
        }
    }).catch((err) => {
        res.send({ status: false, error: "Something Error " + err })
    })

})



router.get("/get_all_user", async (req, res) => {

    adminHelper.getAllUser().then((data) => {
        if (data) {
            res.send({ status: true, users: data })
        } else {
            res.send({ status: false, error: "Something Went Wrong" })
        }
    }).catch((err) => {
        res.send({ status: false, error: "Something Error " + err })
    })

})


router.get("/get_user", (req, res) => {

    let user_id = req.query.user_id;


    adminHelper.findUser(user_id).then((data) => {
        if (data) {
            res.send({ status: true, user: data })
        } else {
            res.send({ status: false, error: "No data found" })
        }
    }).catch((err) => {
        res.send({ status: false, error: "Something Error " + err })
    })


})


router.post("/update_user", async (req, res) => {



  

    let user_id = req.body.userid;
    let profile = req.files?.profile
    let fileName = "user_profile_" + profile?.name

    let userData = {
        name: req.body?.name,
        username: req.body?.username,
        phone: req.body?.phone,
        email: req.body?.email,
    }

    if (req.body.password && req.body.password.trim() != "") {
        userData.password = req.body?.password
    }

 

    if (profile) {
        try {

            let pathto = path.join(__dirname, "../public/user_profile/" + fileName);
            await fileHelper.moveFileUpload(path.join(pathto), profile);
            userData.profile = fileName
        } catch (e) {
            res.send({ status: false, error: "Something Error " + e })
        }
    }

    adminHelper.updateUser(user_id, userData).then((data) => {
        console.log(userData);
        if (data) {
            res.send({ status: true, user: data })
        } else {
            res.send({ status: false, error: "Update Failed" })
        }
    }).catch((err) => {
        res.send({ status: false, error: "Something Error " + err })
    })
})


router.post("/delete_user", (req, res) => {

    let user_id = req.body.user_id;
    console.log("Delete user", user_id)

    adminHelper.deleteUser(user_id).then((delete_user) => {
        res.send({ status: true, deleted_id: user_id, delete: delete_user })
    }).catch((err) => {
        res.send({ status: false, error: "Something Error " + err })
    })

})



router.post("/add_user", async (req, res) => {

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


    try {

        let pathto = path.join(__dirname, "../public/user_profile/" + fileName);


        await fileHelper.moveFileUpload(pathto, file);

        let user = new UserModel(userData)
        user.save().then((data) => {
            res.send({ status: true, user: data })
        }).catch((err) => {
            res.send({ status: false, error: err })
        })

    } catch (e) {
        res.send({ status: false, error: "Image Main Error" + e })
    }

})



router.get("/get_edit_value", (req, res) => {

    let editID = req.query.editid;

    UserModel.findById(editID).then((user) => {
        console.log(user);
        res.send({ status: true, user })
    }).catch((err) => {
        res.send({ status: false })
    })
})

module.exports = router