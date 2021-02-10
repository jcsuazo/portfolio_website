import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import {
  getAllPosts,
  createPost,
  likeAPost,
  retweetAPost,
  getPostDetails,
  deleteAPost,
} from '../controllers/postController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
router.route('/:id/like').put(protect, likeAPost);

// @desc    Retweet a post
// @route   POST /api/posts/:id/retweet
// @access  Private
router.route('/:id/retweet').put(protect, retweetAPost);

// @desc    Get a post details | Delete a post
// @route   GET /api/posts/:id | DELETE /api/posts/:id
// @access  Private | Private
router.route('/:id').post(protect, getPostDetails).delete(protect, deleteAPost);

// @desc    Get all posts | Create new post
// @route   GET /api/posts | POST /api/posts
// @access  Private | Private
router.route('/').get(protect, getAllPosts).post(protect, createPost);

export default router;
