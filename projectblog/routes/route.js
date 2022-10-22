const express = require('express');
const Router = express.Router();

const AuthorController = require("../controllers/AuthorController")
const BlogController = require("../Controllers/BlogsController")
const {auth} = require("../middleware/auth")





Router.post("/authors", AuthorController.createAuthor)
Router.post("/signup", AuthorController.login)
Router.post("/blogs",auth,BlogController.createBlog)
Router.get("/blogs", BlogController.getBlogs)
Router.put("/blogs/:blogId",auth, BlogController.updateBlog)
Router.delete("/blogs/:blogId",auth, BlogController.deleteBlog)
Router.delete("/blogs?queryParams",auth, BlogController.updateBlog)






module.exports = Router





