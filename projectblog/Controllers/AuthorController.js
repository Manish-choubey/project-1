const AuthorModel = require("../Models/AuthorModel")
const validation = require("../validation/validation")
const jwt = require('jsonwebtoken');
//const { findOne } = require("../Models/AuthorModel");
const createAuthor = async function (req, res) {
    try {
        let requestBody = req.body;
        if(!validation.isValidRequestbody(requestBody)){
            res.status(400).send({status:false,msg:"invalid request parameters.please provide author details"})
        }
        let { fname, lname, title, email, password } = requestBody

        if (!validation.isValid(fname)) { return res.status(400).send({ status: false, msg: "please provide the fname" }) }
        if (!validation.isValid(lname)) { return res.status(400).send({ status: false, msg: "please provide the lname" }) }
        if (!validation.isValidTitle(title)) { return res.status(400).send({ status: false, msg: "please provide the title" }) }


        if (!validation.isValidEmail(email)) { return res.status(400).send({ status: false, msg: "please provide valid email" }) }

        let author = await AuthorModel.findOne({ email: email })
        if (author) { return res.status(400).send({ status: false, msg: "this email already exists please provide another email" }) }
        if (!validation.isValidPwd(password)) { return res.status(400).send({ status: false, msg: "please provide the password" }) }
        let savedata = await AuthorModel.create(requestBody)

        res.status(201).send({ status: true, msg: savedata })
    }
    catch (error) {

        res.status(500).send({ status: false, msg: error.message })
    }

};

        
const login = async function (req,res){
    let requestBody = req.body
    if(!requestBody){
        res.status(400).send({status:false,msg:"please provide some data in body"})
    }

    const {email,password} = requestBody
    if(!validation.isValid(email)){
        res.status(400).send({status:false,msg:"email is mendtory"})
    }
    if(!validation.isValidEmail(email)){
        res.status(400).send({status:false,msg:"please provided valid email"})
    }

    

    if(!validation.isValid(password)){
        res.status(400).send({status:false,msg:"please provide password"})

    }
    if(!validation.isValidPwd(password)){
        res.status(400).send({status:false,msg:"password is not valid"})
    }

    let author = await AuthorModel.findOne({email:email,password:password})
    if(!author){
        res.status(400).send({status:false,msg:"password or email is not correct"})
    }

    


    let token = jwt.sign(
        {
            authorId: author._id.toString()
        },
        "VRCA"
    );


        return res.status(201).send({status:true,msg:"Author log in successfull",data:token})
}

module.exports.login=login
module.exports.createAuthor = createAuthor;