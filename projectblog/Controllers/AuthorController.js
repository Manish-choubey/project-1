const AuthorModel = require("../Models/AuthorModel")

const createAuthor = async function(req, res){
try{
let data = req.body;
let savedata = await AuthorModel.create(data)

res.status(201).send({status:true, msg: savedata})}
catch(error){

    res.status(500).send({status:false, msg: error.message})
}

};


module.exports.createAuthor=createAuthor;