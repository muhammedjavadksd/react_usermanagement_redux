let jwt = require("jsonwebtoken");
const secret = "dQnh9&q!D9oaAKSw$*/ZO:6UJypkS,";

let tokenUtil = {
    primtGenerateToken: function (userid) {
        try {
            let token = jwt.sign(userid, secret, { algorithm: 'HS256', expiresIn: '1d' })
            return token
        } catch (e) { 
            return false;
        }

    },

    SecondryGenerateToken: function (userid) {
        try {
            let token = jwt.sign(userid, secret, { algorithm: 'HS256', expiresIn: '1d' })
            return token
        } catch (e) { 
            return false;
        }
    }
}


module.exports = tokenUtil