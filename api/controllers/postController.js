const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

// GET Posts
exports.index = asyncHandler(async (req, res, next) => {
	const posts = await Post.find({ published: true })
		.sort({ timestamp: -1 })
		.limit(20)
		.select("title createdAt updatedAt author")
		.populate("author", "username -_id")
		.exec();

	res.json({ posts });
});

// GET Single Post
exports.post_detail = asyncHandler(async (req, res, next) => {
	const [post, comments] = await Promise.all([
		Post.findById(req.params.postid).populate("author").exec(),
		Comment.find({ post: req.params.postid }).exec(),
	]);

	if (post === null || post.published === false) {
		// No results or post has not been published
		const err = new Error("Post not found");
		err.status = 404;
		return next(err);
	}

	res.json({ post, comments });
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
			published: req.body.published,
			author: req.user._id,
		});

		if (!errors.isEmpty()) {
			// Send JSON back with sanitized value
			res.json({ post, errors });
		} else {
			await post.save();
			res.redirect("/api/posts");
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
			published: req.body.published,
			author: req.user.id,
			_id: req.params.postid,
		});

		if (!errors.isEmpty()) {
			// There are errors send JSON back with sanitized values
			res.json({ post, errors });
		} else {
			const updatedPost = await Post.findByIdAndUpdate(
				req.params.postid,
				post,
				{},
			);
			res.redirect(updatedPost.url);
		}
	}),
];

// DELETE Post
exports.post_delete = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.postid).exec();

	if (post === null) {
		// No results.
		res.redirect("/api/posts");
	} else {
		await Post.findByIdAndDelete(req.params.postid);
		res.redirect("/api/posts");
	}
});

// POST Comment creation
exports.comment_create = [
	body("text")
		.trim()
		.notEmpty()
		.withMessage("Comment must not be empty")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const comment = new Comment({
			text: req.body.text,
			author: req.user.id,
			post: req.params.postid,
		});

		if (!errors.isEmpty()) {
			// There are errors send JSON back with sanitized values
			res.json({ comment, errors });
		} else {
			await comment.save();
			res.redirect(`/api/posts/${req.params.postid}`);
		}
	}),
];

// PUT Comment
exports.comment_update = [
	body("text")
		.trim()
		.notEmpty()
		.withMessage("Comment must not be empty")
		.escape(),
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);
		const comment = new Comment({
			text: req.body.text,
			author: req.user.id,
			post: req.params.postid,
			_id: req.params.commentid,
		});

		if (!errors.isEmpty()) {
			// There are errors send JSON back with sanitized values
			res.json({ comment, errors });
		} else {
			const updatedComment = await Comment.findByIdAndUpdate(
				req.params.commentid,
				comment,
				{},
			);
			res.redirect(`/api/posts/${req.params.postid}`);
		}
	}),
];

// DELETE Comment
exports.comment_delete = asyncHandler(async (req, res, next) => {
	const comment = await Comment.findById(req.params.commentid).exec();

	if (comment === null) {
		// No results.
		res.redirect(`/api/posts/${req.params.postid}`);
	} else {
		await Comment.findByIdAndDelete(req.params.commentid);
		res.redirect(`/api/posts/${req.params.postid}`);
	}
});
