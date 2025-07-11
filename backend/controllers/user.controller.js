import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import url from 'url';
import userSchemaModel from '../models/user.model.js';
import sendEmail from './email.controller.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, mobile, address } = req.body;

    if (!name || !email || !password || !mobile || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userSchemaModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userSchemaModel({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      role: 'user',
      status: 0
    });

    await newUser.save();
    sendEmail(email, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};export const verifyEmail = async (req, res) => {
  try {
    // ✅ Support both query param and body
    const token = req.body.token || req.query.token;

    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await userSchemaModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.status === 1) return res.status(400).json({ message: "Already verified" });

    user.status = 1;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const fetch = async (req, res) => {
  try {
    const condition_obj = url.parse(req.url, true).query;
    const users = await userSchemaModel.find(condition_obj);

    if (users.length !== 0) {
      res.status(200).json({ users });
    } else {
      res.status(404).json({ status: "not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Fetch error', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { condition_obj, content_obj } = req.body;
    const user = await userSchemaModel.findOne(condition_obj);

    if (!user) return res.status(404).json({ result: "user not found" });

    const updatedUser = await userSchemaModel.updateOne(condition_obj, { $set: content_obj });

    if (updatedUser.modifiedCount > 0) {
      res.status(200).json({ result: "user updated successfully" });
    } else {
      res.status(400).json({ result: "no changes made" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Update error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { condition_obj } = req.body;
    const user = await userSchemaModel.findOne(condition_obj);

    if (!user) return res.status(404).json({ result: "user not found in data" });

    await userSchemaModel.deleteOne(condition_obj);
    res.status(200).json({ result: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ result: "user not deleted", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchemaModel.findOne({ email, status: 1 });

    if (!user) return res.status(404).json({ message: "User not found or not active" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await userSchemaModel.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userSchemaModel.updateOne({ email }, { $set: { password: hashedNewPassword } });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userSchemaModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === 1) {
      return res.status(400).json({ message: "Email already verified" });
    }

    sendEmail(email);
    res.status(200).json({ message: "Verification email resent" });
  } catch (error) {
    res.status(500).json({ message: "Resend verification failed", error: error.message });
  }
};
export const checkVerification = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userSchemaModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === 1) {
      return res.status(200).json({ message: "Email is verified" });
    } else {
      return res.status(200).json({ message: "Email is not verified" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking verification", error: error.message });
  }
};
