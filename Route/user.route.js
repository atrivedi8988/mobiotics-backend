const express = require("express");
const { isAuthenticate, isAuthorize } = require("../Middlewares/auth");
const {
  registerUser,
  loggedInUser,
  getProfileAuthenticateUser,
  getAllUserByAdmin,
  makeAdmin,
  forgotPassword,
  resetPassword,
} = require("../Controller/user.controller");

const router = express.Router();

// create new account
router.post("/create", registerUser);

// login account
router.post("/login", loggedInUser);

// Get Profile Authenticate User
router.get("/profile", isAuthenticate, getProfileAuthenticateUser);

// Get All User --- Admin authorize
router.get("/allusers", isAuthenticate, isAuthorize, getAllUserByAdmin);

// change user to admin and make a admin
router.patch("/assignadmin/:id", isAuthenticate, isAuthorize, makeAdmin);

// forgot password
router.post("/forgot", forgotPassword);

// Reset Password
router.patch("/reset/:id/:token", resetPassword);

module.exports = router;
