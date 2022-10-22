const BlogsModel = require("../Models/BlogsModel")
const AuthorModel = require("../Models/AuthorModel")
const validation = require("../validation/validation")
const moment = require('moment');
//const { isValidBody } = require("../../../../projrct 5 shping/project-productsManagementGroup15/src/validation/validation")
//const auth = require("../middleware/auth")

const createBlog = async function(req, res){

    try{
        let requestBody = req.body
        if(!validation.isValidRequestbody(requestBody)){
           res.status(400).send({status:false,msg:"please provide data in reuestbody"})
        }
    let { title, body, authorId, tags,category} = requestBody

    if (!title) { return res.status(400).send({ status: false, msg: "please provide the title" })}
    if (!body) { return res.status(400).send({ status: false, msg: "please provide the body" })}
    if (!authorId) { return res.status(400).send({ status: false, msg: "please provide the authorId"})}
    if (!tags) { return res.status(400).send({ status: false, msg: "please provide the tags" })}
    if (!category) { return res.status(400).send({ status: false, msg: "please provide the category" })}
    let author = await AuthorModel.findOne({ authorId: authorId })
    if (!author) { return res.status(400).send({ status: false, msg: "this authorId is not valid " })}
    if(req.validToken.authorId != requestBody.authorId)   return res.status(403).send({status : false, msg : "Not Authorised"})
    let savedata = await BlogsModel.create(requestBody)

    res.status(201).send({status : true, msg: savedata})}
    catch(error){
        res.status(500).send({ status: false, msg: error.message })
    }
}


const getBlogs = async function(req, res) {
    try {
      // Spreading query to pass all the filters in condition
     let queries = req.query
     const {authorId,category,tags,Subcategory,isPublished} =queries
     let filter = {isDeleted:false}

     if(authorId)filter.authorId = authorId
     if(category)filter.category = category
     if(tags)filter.tags = tags
     if(Subcategory)filter.Subcategory = Subcategory
     if(isPublished)filter.isPublished = isPublished

     let requiredata = await BlogsModel.find(filter)
     if(requiredata.length==0) return res.status(404).send({status:false,msg:"no data found"})

     return res.status(200).send({ status: true, message: 'Success', data: requiredata })
      
  }catch (err) {
    return res.status(500).send({ status: false, error: err.message })
}
  
}


const updateBlog = async function(req, res) {
    //try {
        const blogId = req.params.blogId
        if (!blogId.match(/^[0-9a-fA-F]{24}$/))   return res.status(400).send({status: false,msg: "Incorrect Blog Id format"})
        
        const blog = await BlogsModel.findById(blogId)
        if(!blog)   return res.status(404).send({status : false, msg : "Blog Id is incorrect"})
        if(blog.isDeleted == true)  return res.status(404).send({status : false, msg : "Blog doesn't exist"})
        //if(Object.keys(req.body).length == 0)   return res.status(400).send({status : false, msg : "Empty body for update"})
        if(req.validToken.authorId != blog.authorId)   return res.status(403).send({status : false, msg : "Not Authorised"})
        
    
        // We are using for..in to iterate over the key:value pairs of req.body
        
        for(const key in req.body){
            if(typeof req.body[key] == "boolean")  return res.status(400).send({ status: false, msg: `Please enter the ${key} in right format...!` });

            // Updating our req.body to add isPublished & publishedAt fields

            if(key == "isPublished")   req.body = {...req.body, isPublished : req.body.isPublished, publishedAt: moment().format('YYYY-MM-DDTss:mm:h')}

            // For the keys whose value is a type array ex tags & subcategory we are pushing the elements present inside our existing blog to the array of req.body

            if(typeof (req.body[key]) == "object"){
                req.body[key].push(...blog[key]);
            }
        }

        // All the updates that have to be done are first passed inside an object query like updates inside req.body, isPublished and publishedAt.

        let query = {...req.body}
        const updatedBlog = await BlogsModel.findOneAndUpdate({_id : blogId}, query, {new : true})

        return res.status(200).send ({status: true, data: updatedBlog });
    //} catch (error) {
      //  return res.status(500).send ({status: false, msg: error.message });
    }
//}




const deleteBlog = async function (req, res) {
    try {
      let blogId = req.params.blogId;
      if (!blogId.match(/^[0-9a-fA-F]{24}$/))   return res.status(400).send({status: false,msg: "Incorrect BlogId format"});

      let blog = await BlogsModel.findById(blogId);
      if (!blog)   return res.status(404).send({status: false,msg:"BlogId is incorrect"});
      if (blog.isDeleted == true)  return res.status(400).send({ status: false, msg: "Blog doesn't exist" })
      if(req.validToken.authorId !== blog.authorId.toString())   return res.status(403).send({status : false, msg : "Not Authorised"})

      let deletedBlog = await BlogsModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true ,deletedAt: Date.now()} }, { new: true });
      res.status(200).send({status: true, data: deletedBlog });
     }
    catch (err) {
         res.status(500).send({status: false, msg: "Error", error: err.message })
     }
 }



 const deleteBlogByParams = async function(req,res){
    try{ 
        const queryParams = req.query
        if(Object.keys(queryParams).length == 0)  return res.status(400).send({status: false,msg: "Nothing passed in filter"});

        // Finding all the documents that pass the filter given in req.query

        const blog = await BlogsModel.find({...queryParams, isDeleted : false})

        // Checking authorisation on each document inside blog & pushing the id of all those documents which pass authorisation inside arr

        let arr = []
        blog.forEach((ele, index) => {
            if(req.validToken.authorId == ele.authorId.toString())   arr.push(ele._id)
        })

        // Deleting all the documents whose id was passed in arr

        const deletedBlog = await BlogsModel.updateMany({_id : arr}, { $set: { isDeleted: true ,deletedAt: moment().format('YYYY-MM-DDTss:mm:h')} }, {new : true})

        // If no document was deleted, modified count will be 0, using that to send message to user.

        if(deletedBlog.modifiedCount == 0)   return res.status(404).send({status: false, msg: "Blog doesn't Exist"})

        return res.status(200).send({status: true, data: `Number of documents deleted : ${deletedBlog.modifiedCount}`})
    }catch(err){
        return res.status(500).send({status: false, msg:err.message})
    }
}







module.exports.getBlogs = getBlogs
module.exports.createBlog = createBlog;
module.exports.updateBlog=updateBlog
module.exports.deleteBlog=deleteBlog
module.exports.deleteBlogByParams

