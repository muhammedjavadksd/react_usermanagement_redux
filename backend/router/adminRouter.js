

const express = require("express");
const router = express.Router();
let fileHelper = require("../helper/file_helper");
let path = require("path")
let UserModel = require("../mongo/model/user_model");
let userHelper = require("../helper/userHelper");
let adminHelper = require("../helper/adminHelper");
let tokenHelper = require("../helper/token")
const { default: mongoose } = require("mongoose");
let jwt = require("jsonwebtoken")
const const_data = require("../const/const")
const instance = require("../axios/instance")


function isValidJWT(req, res, next) {




    const tokenHeader = req.header('Authorization');
    console.log("Header", tokenHeader)

    if (tokenHeader) {
        const token = tokenHeader.split(" ")[1];

        try {
            jwt.verify(token, const_data.SECRET_CODE, (err, data) => {
                if (err) {
                    console.log("Invalid JWT");
                    res.status(401).json({ status: false, msg: "Invalid JWT" });
                } else {
                    next();
                }
            });
        } catch (e) {
            console.error("Error parsing JWT:", e);
            res.status(401).json({ status: false, msg: "Error parsing JWT" });
        }
    } else {
        console.log("No JWT provided");
        res.status(401).json({ status: false, msg: "No JWT provided" });
    }


}


router.get("/refresh_token", (req, res) => {

    let tokenID = req.query.refresh_reference;


    adminHelper.findAdminByToken(tokenID).then((admin) => {


        if (admin) {
            let accessToken = tokenHelper.primtGenerateToken({ "username": admin.username });
            let refreshToken = tokenHelper.SecondryGenerateToken({ "username_cred": admin.username });

            const updateData = {
                refreshToken
            }

            adminHelper.updateAdmin(admin._id, updateData).then((dt) => {
                res.send({
                    status: true, admin: admin, refresh_reference: dt._id,
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
        res.status(401).json({ status: false, msg: "Do not have auth" })
    }
    )
})

router.get("/validate_jwt", (req, res) => {

    const token = req.query.access_token
    if (!token) {
        res.status(401).json({ status: false, msg: "Do not have auth" })
    }

    jwt.verify(token, const_data.SECRET_CODE, async (err, data) => {
        if (err) {
            res.status(403).send({ status: false, msg: "You don't have auth" })
        } else {
            res.send({ status: true, admin: data, token: req.query.access_token })
        }

    })
})

router.post("/admin_login", async (req, res) => {


    console.log("Reached on here")
    let username = req.body.username;
    let password = req.body.password;

    adminHelper.adminLogin(username, password).then((data) => {

        if (data) {
            let accessToken = tokenHelper.primtGenerateToken({ username });
            let refreshToken = tokenHelper.SecondryGenerateToken({ username });
            const updateData = {
                refreshToken
            }

            adminHelper.updateAdmin(data._id, updateData).then((dt) => {
                console.log("HELO")
                res.send({ status: true, admin: data, access_token: accessToken, refresh_reference: dt._id })
            }).catch((err) => {
                console.log(err)
                res.send({ status: false, error: "Updation Issue", msg: err })
            })
        } else {
            res.send({ status: false, error: "Invalid username and password" })
        }

    }).catch((err) => {
        res.send({ status: false, error: "Something Error " + err })
    })

})



router.get("/get_all_user", isValidJWT, async (req, res) => {



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


router.get("/get_user", isValidJWT, (req, res) => {

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


router.post("/update_user", isValidJWT, async (req, res) => {



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


router.post("/delete_user", isValidJWT, (req, res) => {

    let user_id = req.body.user_id;
    console.log("Delete user", user_id)

    adminHelper.deleteUser(user_id).then((delete_user) => {
        res.send({ status: true, deleted_id: user_id, delete: delete_user })
    }).catch((err) => {
        res.send({ status: false, error: "Something Error " + err })
    })

})



router.post("/add_user", isValidJWT, async (req, res) => {

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



router.get("/get_edit_value", isValidJWT, (req, res) => {

    let editID = req.query.editid;

    UserModel.findById(editID).then((user) => {
        console.log(user);
        res.send({ status: true, user })
    }).catch((err) => {
        res.send({ status: false })
    })
})

module.exports = router