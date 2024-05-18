const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

// GET Users
exports.user_list = asyncHandler(async (req, res, next) => {
	const users = await User.find()
		.sort({ joined: -1 })
		.limit(20)
		.select("username profile_pic joined")
		.exec();

	res.json({ users });
});

// GET Single User
exports.user_detail = asyncHandler(async (req, res, next) => {
	const [user, posts] = await Promise.all([
		User.findById(req.params.userid).select("-password").exec(),
		Post.find({ author: req.params.userid }).exec(),
	]);

	if (user === null) {
		const err = new Error("User not found");
		err.status = 404;
		return next(err);
	}

	res.json({ user, posts });
});

// POST User
exports.user_create = [
	body("username")
		.trim()
		.isLength(6)
		.withMessage("Username must be at least 6 characters")
		.escape(),
	body("password")
		.trim()
		.isLength(8)
		.withMessage("Password must be at least 8 characters")
		.escape(),
	body("first_name")
		.trim()
		.isLength(2)
		.withMessage("First name must be at least 2 characters")
		.escape(),
	body("last_name")
		.trim()
		.isLength(2)
		.withMessage("Last name must be at least 2 characters")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const user = new User({
			username: req.body.username,
			// Add encryption here
			password: req.body.password,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			// Add multer here
			profile_pic: req.body.profile_pic,
			isAuthor: req.body.isAuthor,
			joined: new Date(),
		});

		if (!errors.isEmpty()) {
			// Send JSON back with sanitized value
			res.json({ user, errors });
		} else {
			await user.save();
			// Change redirect to posts after debug
			res.redirect("/users");
		}
	}),
];

// PUT User
exports.user_update = [
	body("username")
		.trim()
		.isLength(6)
		.withMessage("Username must be at least 6 characters")
		.escape(),
	body("password")
		.trim()
		.isLength(8)
		.withMessage("Password must be at least 8 characters")
		.escape(),
	body("first_name")
		.trim()
		.isLength(2)
		.withMessage("First name must be at least 2 characters")
		.escape(),
	body("last_name")
		.trim()
		.isLength(2)
		.withMessage("Last name must be at least 2 characters")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const user = new User({
			username: req.body.username,
			// Add encryption here
			password: req.body.password,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			// Add multer here
			profile_pic: req.body.profile_pic,
			isAuthor: req.body.isAuthor,
			joined: new Date(),
			_id: req.params.userid,
		});

		if (!errors.isEmpty()) {
			// There are errors send JSON back with sanitized values
			res.json({ user, errors });
		} else {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.userid,
				user,
				{},
			);
			res.redirect(updatedUser.url);
		}
	}),
];

// DELETE User
exports.user_delete = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.userid).exec();

	if (user === null) {
		// No results.
		res.redirect("/users");
	} else {
		await User.findByIdAndDelete(req.params.userid);
		res.redirect("/users");
	}
});
