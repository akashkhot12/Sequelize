const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const register = async (req, res) => {
  try {
    const { firstname, lastname, username, password, email, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      username,
      password: hashedPassword,
      email,
      phone,
      created: new Date(),
      updated: new Date(),
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    // Here you would send the token to the user's email
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      { where: { id: decoded.id } }
    );
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: user.id } });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  getAllUsers,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
};
