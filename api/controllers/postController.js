const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

// GET Posts
exports.index = asyncHandler(async (req, res, next) => {
	res.json({ message: "Index not implemented" });
});

// GET Single Post
exports.post_read = asyncHandler(async (req, res, next) => {
	res.json({ message: "Post detail not implemented" });
});

// POST Post creation
exports.post_create = asyncHandler(async (req, res, next) => {
	res.json({ message: "Post POST not implemented" });
});

// PUT Post
exports.post_update = asyncHandler(async (req, res, next) => {
	res.json({ message: "Post UPDATE not implemented" });
});

// DELETE Post
exports.post_delete = asyncHandler(async (req, res, next) => {
	res.json({ message: "Post DELETE not implemented" });
});

// POST Comment creation
exports.comment_create = asyncHandler(async (req, res, next) => {
	res.json({ message: "Comment POST not implemented" });
});

// PUT Comment
exports.comment_update = asyncHandler(async (req, res, next) => {
	res.json({ message: "Comment UPDATE not implemented" });
});

// DELETE Comment
exports.comment_delete = asyncHandler(async (req, res, next) => {
	res.json({ message: "Comment DELETE not implemented" });
});
