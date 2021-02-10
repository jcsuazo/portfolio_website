import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { logUserName, logPassword } = req.body;
  const user = await User.findOne({
    $or: [{ username: logUserName }, { email: logUserName }],
  });
  if (user && (await user.matchPassword(logPassword))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Invalid email or password');
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, password } = req.body;
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by usename
// @route   GET /api/users/:usename/username
// @access  Private
const getUserByUsername = asyncHandler(async (req, res) => {
  let user = await User.findOne({ username: req.params.username }).select(
    '-password',
  );
  if (!user) {
    user = req.user;
  }
  const replyTo = await getPosts({ postedBy: user._id, isReply: true });
  const posts = await getPosts({ postedBy: user._id, isReply: false });
  const results = {
    user,
    replyTo,
    posts,
  };
  if (user) {
    res.status(200).send(results);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/user/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, isAdmin } = req.body;

  const user = await User.findById(req.params.id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Follow or un-follow another user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const logInUser = req.user;

  let isLiked = logInUser.following && logInUser.following.includes(id);

  let option = isLiked ? '$pull' : '$addToSet';
  try {
    const currentUser = await User.findByIdAndUpdate(logInUser._id, {
      [option]: { following: id },
    });
    const followingUser = await User.findByIdAndUpdate(id, {
      [option]: { followers: logInUser._id },
    });
  } catch (error) {
    res.send(error);
  }
  res.sendStatus(200);
});

async function getPosts(filter) {
  let results = await Post.find(filter)
    .populate('postedBy')
    .populate('replyTo')
    .populate('retweetData')
    .sort({ createdAt: -1 })
    .catch((error) => console.log(error));
  results = await User.populate(results, { path: 'replyTo.postedBy' });
  // results = await Post.populate(results, { path: 'replyTo.retweetData' });
  return await User.populate(results, { path: 'retweetData.postedBy' });
}
export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserByUsername,
  followUser,
};
