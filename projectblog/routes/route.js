const express = require('express');
const Router = express.Router();

const AuthorController = require("../controllers/AuthorController")
const BlogController = require("../controllers/BlogController")





Router.post("/authors", AuthorController.createAuthor)





module.exports = Router





