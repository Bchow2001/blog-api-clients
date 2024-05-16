const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

// GET Posts
exports.index = asyncHandler(async (req, res, next) => {
	const posts = await Post.find({ published: true })
		.sort({ timestamp: -1 })
		.limit(20)
		.select("title timestamp author")
		.populate("author")
		.exec();

	res.json({ posts });
});

// GET Single Post
exports.post_detail = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id).populate("author").exec();

	if (post === null) {
		// No results.
		const err = new Error("Post not found");
		err.status = 404;
		return next(err);
	}

	res.json({ post });
});

// POST Post creation
exports.post_create = [
	body("title")
		.trim()
		.isLength(3)
		.withMessage("Title must be at least 3 characters")
		.escape(),
	body("text")
		.trim()
		.notEmpty()
		.withMessage("Text must not be empty")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const post = new Post({
			title: req.body.title,
			text: req.body.text,
			timestamp: new Date(),
			published: req.body.published,
			author: req.user.id,
		});
		if (!errors.isEmpty()) {
			// Send JSON back with sanitized value
			res.json({ post, errors });
		} else {
			await post.save();
			res.redirect("/posts");
		}
	}),
];

// PUT Post
exports.post_update = [
	body("title")
		.trim()
		.isLength(3)
		.withMessage("Title must be at least 3 characters")
		.escape(),
	body("text")
		.trim()
		.notEmpty()
		.withMessage("Text must not be empty")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const post = new Post({
			title: req.body.title,
			text: req.body.text,
			timestamp: new Date(),
			published: req.body.published,
			author: req.user.id,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			// There are errors send JSON back with sanitized values
			res.json({ post, errors });
		} else {
			const updatedPost = await Post.findByIdAndUpdate(
				req.params.id,
				post,
				{},
			);
			res.redirect(updatedPost.url);
		}
	}),
];

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
