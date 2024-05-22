require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
require("../config");

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
		.custom(async (value) => {
			const userExists = await User.findOne({
				username: value,
			})
				.collation({ locale: "en", strength: 2 })
				.exec();
			if (userExists) {
				throw new Error("Username is already in use");
			}
		})
		.escape(),
	body("password")
		.trim()
		.isLength(8)
		.withMessage("Password must be at least 8 characters")
		.escape(),
	body("confirm_password")
		.trim()
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords must match")
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
			// Data from form is valid and username is not duplicate
			// Hash the password and add to user object
			bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
				if (err) {
					next(err);
				} else {
					user.password = hashedPassword;
					await user.save();
					// change redirect to posts after debug
					res.redirect("/api/users");
				}
			});
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
		res.redirect("/api/users");
	} else {
		await User.findByIdAndDelete(req.params.userid);
		res.redirect("/api/users");
	}
});

// LOG IN User
exports.user_login = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Please enter a username")
		.escape(),
	body("password")
		.trim()
		.notEmpty()
		.withMessage("Please enter a password")
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// There are errors
			res.json({ errors });
		} else {
			passport.authenticate(
				"local",
				{ session: false },
				(err, user, message) => {
					if (err) {
						return res.json({ err });
					}
					if (!user) {
						return res.json({ message });
					}
					const { _id } = user;

					/** This is what ends up in our JWT */
					const payload = { _id };

					/** assigns payload to req.user */
					req.login(payload, { session: false }, (error) => {
						if (error) {
							return res.status(400).send({ error });
						}

						/** generate a signed json web token and return it in the response */
						const accessToken = jwt.sign(
							payload,
							process.env.JWT_SECRET,
							{ expiresIn: "30m" },
						);

						/** assign our jwt to the cookie */
						res.json({ accessToken });
					});
				},
			)(req, res, next);
		}
	}),
];
