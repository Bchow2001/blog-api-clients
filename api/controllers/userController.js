const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

// GET Users
exports.user_list = asyncHandler(async (req, res, next) => {
	res.json({ message: "User list not implemented" });
});

// GET Single User
exports.user_detail = asyncHandler(async (req, res, next) => {
	res.json({ message: "User detail not implemented" });
});

// POST User
exports.user_create = asyncHandler(async (req, res, next) => {
	res.json({ message: "User POST not implemented" });
});

// PUT User
exports.user_update = asyncHandler(async (req, res, next) => {
	res.json({ message: "User PUT not implemented" });
});

// DELETE User
exports.user_delete = asyncHandler(async (req, res, next) => {
	res.json({ message: "User DELETE not implemented" });
});
