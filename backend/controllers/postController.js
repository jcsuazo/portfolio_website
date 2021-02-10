import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getAllPosts = asyncHandler(async (req, res) => {
  let searchObj = req.query;
  const results = await getPosts(searchObj);
  res.status(200).send(results);
});

// @desc    Get a post details
// @route   GET /api/posts/:id
// @access  Private
const getPostDetails = asyncHandler(async (req, res) => {
  let postId = req.params.id;
  let postData = await getPosts({ _id: postId });
  postData = postData[0];
  const results = {
    postData: postData,
  };
  if (postData.replyTo !== undefined) {
    let replyTo = await getPosts({ _id: postData.replyTo._id });

    results.replyTo = replyTo[0];
  }
  results.replies = await getPosts({ replyTo: postId });
  res.status(200).send(results);
});

// @desc    Remove a post
// @route   PUT /api/posts/:id
// @access  Private
const deleteAPost = asyncHandler(async (req, res) => {
  let postId = req.params.id;
  const post = await Post.findById(postId);
  if (post.postedBy._id.toString() == req.user._id.toString()) {
    await post.remove();
    res.sendStatus(202);
  } else {
    res.send(401);
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  if (!req.body.content) {
    console.log('Content param not sent with request');
    return res.sendStatus(400);
  }
  try {
    const newPost = await Post.create({
      ...req.body,
      postedBy: req.user._id,
    });
    const newPostAndUser = await User.populate(newPost, { path: 'postedBy' });
    return res.status(201).send(newPostAndUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likeAPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  let isLiked = user.likes && user.likes.includes(id);

  let option = isLiked ? '$pull' : '$addToSet';
  // Insert user like
  await User.findByIdAndUpdate(
    user._id,
    {
      [option]: { likes: id },
    },
    { new: true },
  );
  //Insert post like
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      [option]: { likes: user._id },
    },
    { new: true },
  );

  res.status(200).send(updatedPost);
});

// @desc    Retweet a post
// @route   POST /api/posts/:id/retweet
// @access  Private
const retweetAPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  //Inserting or removing a the a retweeted post
  let deletedPost = await Post.findOneAndDelete({
    postedBy: user._id,
    retweetData: id,
  });

  //If a post was remove pull if it was not addToSet
  let option = deletedPost ? '$pull' : '$addToSet';

  let repost = deletedPost;

  if (repost == null) {
    repost = await Post.create({ postedBy: user._id, retweetData: id });
  }
  //Inserting or removing a the post that was retweeted to the user
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      [option]: { retweets: repost._id },
    },
    { new: true },
  );
  //Inserting or removing a the user that retweeted the post to the user
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      [option]: { retweetUsers: user._id },
    },
    { new: true },
  );

  res.status(200).send(updatedPost);
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
  getAllPosts,
  createPost,
  likeAPost,
  retweetAPost,
  getPostDetails,
  deleteAPost,
};
