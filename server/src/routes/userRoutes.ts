// src/routes/userRoutes.ts

import express, { Router } from "express"; // Import express and Router
import {
  changePassword,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/auth/userController.ts"; // Import user controller functions
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.ts"; // Import middleware functions
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.ts"; // Import admin controller functions

const router: Router = express.Router(); // Create a new router instance

// User routes
router.post("/register", registerUser); // Route for user registration
router.post("/login", loginUser); // Route for user login
router.get("/logout", logoutUser); // Route for user logout
router.get("/user", protect, getUser); // Route to get user information, protected
router.patch("/user", protect, updateUser); // Route to update user information, protected

// Admin routes
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser); // Route to delete a user by ID, protected and admin middleware
router.get("/admin/users", protect, creatorMiddleware, getAllUsers); // Route to get all users, protected and creator middleware

// Other routes
router.get("/login-status", userLoginStatus); // Route to check login status
router.post("/verify-email", protect, verifyEmail); // Route to verify email, protected
router.post("/verify-user/:verificationToken", verifyUser); // Route to verify user via token
router.post("/forgot-password", forgotPassword); // Route to initiate forgot password process
router.post("/reset-password/:resetPasswordToken", resetPassword); // Route to reset password via token
router.patch("/change-password", protect, changePassword); // Route to change password, protected

export default router; // Export the router
