const express = require('express');
const Router = express.Router();

const AuthorController = require("../Controllers/AuthorController")
const BlogController = require("../Controllers/BlogsController")
const commonMid = require("../middleware/auth")

//--------------------------------This is authors api-----------------------------//
Router.post("/authors", AuthorController.createAuthor)

Router.post("/login", AuthorController.loginAuthor)

Router.post("/blogs",commonMid.authenticate, BlogController.createBlog)

Router.get("/blogs",commonMid.authenticate, BlogController.getBlog)

Router.put("/blogs/:blogId",commonMid.authenticate,commonMid.auth, BlogController.updateBlog)

Router.delete("/blogs/:blogId",commonMid.authenticate,commonMid.auth, BlogController.deleteBlogs)

Router.delete("/blogs",commonMid.authenticate,commonMid.auth, BlogController.deleteByquery)

module.exports = Router;