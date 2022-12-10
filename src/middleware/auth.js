const jwt = require('jsonwebtoken');
const adminModel = require('../Models/adminModel');
const mongoose = require('mongoose')


//--------------------------|| AUTHENTICATION ||--------------------------------

const authentication = async function(req, res, next) {
    try {
        token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token is missing" }) }
        decodedToken = jwt.verify(token, "Admin-student-login-panel", (err, decode) => {
            if (err) {
                let message =
                    err.message === "jwt expired" ? "Token is expired" : "Token is invalid";
                return res.status(401).send({ status: false, msg: message })
            }
            req.decode = decode

            next()
        })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//--------------------------|| AUTHORIZATION ||--------------------------------


const Authorisation = async function(req, res, next) {
    try {

        let adminId = req.decode.adminId
        let checkingAdmin = await adminModel.findOne({ _id: adminId })
        if (!checkingAdmin) {
            return res.status(404).send({ status: false, message: "this admin is not found" })
        }
        if (checkingAdmin._id != adminId) {
            return res.status(403).send({ status: false, message: "you are not Authorized person" })
        } else {
            next()
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { authentication, Authorisation }