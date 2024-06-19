const express = require("express");
const passport = require("passport");
require("../config");

const router = express.Router();

const userController = require("../controllers/userController");

// GET user list
router.get("/", userController.user_list);

// POST User
router.post("/", userController.user_create);

// Log-in
router.post("/login", userController.user_login);

// Admin Log-in
router.post("/admin-login", userController.admin_login);

// Authorized
router.get(
	"/admin-login",
	passport.authenticate("jwt-author", { session: false }),
	userController.is_logged_in,
);

// GET single user
router.get("/:userid", userController.user_detail);

// Put User
router.put("/:userid", userController.user_update);

// Delete User
router.delete("/:userid", userController.user_delete);

module.exports = router;
