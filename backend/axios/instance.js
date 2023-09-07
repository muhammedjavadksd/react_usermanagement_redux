let axios = require("axios");

const instance = axios.create({
    baseURL: 'localhost:3000'
});


module.exports = instance