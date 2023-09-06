
let fileUpload = require("express-fileupload");

let fileHelper = {

    moveFileUpload: async (path, file) => {
        await file.mv(path, (err) => {
            if (err) {
                return new Error(err)
            }
 
            return true;
        })
    }
}


module.exports = fileHelper;