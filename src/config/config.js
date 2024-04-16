require("dotenv").config();

const config = {
    mongo_url: process.env.MONGO_URL
}

module.exports = config;