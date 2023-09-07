const express = require("express")
const app = express();
let cookieParser = require("cookie-parser")

let logger = require("morgan")
let cors = require("cors")


let fileUpload = require("express-fileupload")
let mongooseConnection = require("./mongo/connection");

let bodyParser = require("body-parser")

app.use(cookieParser())

app.use(
    cors({
        origin: "http://localhost:3000"
    })
);

app.use(logger("dev"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongooseConnection.connection();

let adminRouter = require("./router/adminRouter");
let userRouter = require("./router/userRouter"); 


app.use(express.static("public"))




app.use(fileUpload())

app.use("/", userRouter)
app.use("/admin", adminRouter)


app.listen(7000, () => {
    console.log("Back end server started ");
})