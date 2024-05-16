const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// GET user list
router.get("/", userController.user_list);

// GET single user
router.get("/:userId", userController.user_detail);

// POST User
router.post("/", userController.user_create);

// Put User
router.put("/:userId", userController.user_update);

// Delete User
router.delete("/:userId", userController.user_delete);

module.exports = router;
