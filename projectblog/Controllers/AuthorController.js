const AuthorModel = require("../Models/AuthorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        let { fname, lname, title, email, password } = data

        if (!fname) { return res.status(400).send({ status: false, msg: "please provide the fname" }) }
        if (!lname) { return res.status(400).send({ status: false, msg: "please provide the lname" }) }
        if (!title) { return res.status(400).send({ status: false, msg: "please provide the title" }) }


        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)) { return res.status(400).send({ status: false, msg: "please provide valid email" }) }

        let author = await AuthorModel.findOne({ email: email })
        if (author) { return res.status(400).send({ status: false, msg: "this email already exists please provide another email" }) }
        if (!password) { return res.status(400).send({ status: false, msg: "please provide the password" }) }
        let savedata = await AuthorModel.create(data)

        res.status(201).send({ status: true, msg: savedata })
    }
    catch (error) {

        res.status(500).send({ status: false, msg: error.message })
    }

};


module.exports.createAuthor = createAuthor;