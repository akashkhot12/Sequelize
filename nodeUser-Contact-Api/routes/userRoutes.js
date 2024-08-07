const express = require("express");
const {
  register,
  getAllUsers,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controller/userController");

const router = express.Router();

router.post("/register", register);
router.get("/", getAllUsers);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);

module.exports = router;
