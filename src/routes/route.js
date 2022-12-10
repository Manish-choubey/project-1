const express = require('express');
const router = express.Router();
const studentController = require("../Controllers/studentController.js")
const adminController = require("../Controllers/adminController.js")
const middleware = require("../middleware/auth")
    //const commonMW = require('../middleware/middleware')


//=========================== post login Admin=======================================//

//-------------------registerAdmin---------------------------//
router.post("/registerAdmin", adminController.adminRegister)

//-------------------Adminlogin---------------------------//
router.post("/logInAdmin", adminController.logInAdmin)


//============================student panel api's=================================//
// create users 

//--------------------------------studentRegister--------------------------------//
router.post("/studentRegister", middleware.authentication, middleware.Authorisation, studentController.studentRegister)

//------------------------------fetching Studentdetails----------------------------//
router.get("/filterStudent", middleware.authentication, middleware.Authorisation, studentController.filterStudent)

//------------------------------edit student details------------------------//
router.put("/editStudent", middleware.authentication, middleware.Authorisation, studentController.editStudents)


//----------------------------deleteStudent--------------------------------------//
router.delete("/deleteStudent", middleware.authentication, middleware.Authorisation, studentController.deleteStudent)




router.all("/*", function(req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})
module.exports = router