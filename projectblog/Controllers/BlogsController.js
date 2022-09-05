const BlogsModel = require("../Models/BlogsModel")
const AuthorModel = require("../Models/AuthorModel")

const createBlog = async function(req, res){

    try{let data = req.body
    let { title, body, authorId, tags,category} = data

    if (!title) { return res.status(400).send({ status: false, msg: "please provide the title" })}
    if (!body) { return res.status(400).send({ status: false, msg: "please provide the body" })}
    if (!authorId) { return res.status(400).send({ status: false, msg: "please provide the authorId"})}
    if (!tags) { return res.status(400).send({ status: false, msg: "please provide the tags" })}
    if (!category) { return res.status(400).send({ status: false, msg: "please provide the category" })}
    let author = await AuthorModel.findOne({ authorId: authorId })
    if (!author) { return res.status(400).send({ status: false, msg: "this authorId is not valid " })}

    let savedata = await BlogsModel.create(data)

    res.status(201).send({status : true, msg: savedata})}
    catch(error){
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createBlog = createBlog;