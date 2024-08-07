const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const Post = require("../models/post");
const Comment = require("../models/comment");

// GET Posts
exports.index = asyncHandler(async (req, res, next) => {
	if (req.user.isAuthor) {
		const posts = await Post.find()
			.sort({ updatedAt: -1 })
			.limit(20)
			.select("title createdAt updatedAt author")
			.populate("author", "username -_id")
			.exec();
		const user = req.user.username;
		res.json({ posts, user });
	} else {
		const posts = await Post.find({ published: true })
			.sort({ updatedAt: -1 })
			.limit(20)
			.select("title createdAt updatedAt author")
			.populate("author", "username -_id")
			.exec();
		const user = req.user.username;
		res.json({ posts, user });
	}
});

// GET Single Post
exports.post_detail = asyncHandler(async (req, res, next) => {
	const [post, comments] = await Promise.all([
		Post.findById(req.params.postid).populate("author").exec(),
		Comment.find({ post: req.params.postid }).populate("author").exec(),
	]);

	if (post === null || post.published === false) {
		// No results or post has not been published
		const err = new Error("Post not found");
		err.status = 404;
		return next(err);
	}

	const user = req.user.username;

	res.json({ post, comments, user });
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
			res.status(403).json(errors);
		} else {
			await post.save();
			res.status(200).json({ message: "Post Created" });
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
			res.status(200).json({ message: "Post updated" });
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
			res.status(403).json(errors);
		} else {
			await comment.save();
			res.status(200).json({ message: "Comment Created" });
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
