import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
//MODELS
import User from '../models/userModel.js';
import Posts from '../models/postModel.js';
//DATA
import users from '../data/users.js';
import posts from '../data/posts.js';
import postReplies from '../data/postReplies.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
const importData = async () => {
  try {
    await Posts.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const myUser = createdUsers[0];

    const samplePosts = posts.map((post) => {
      return {
        ...post,
        postedBy: getRandomItem(createdUsers),
      };
    });
    const allPosts = await Posts.insertMany(samplePosts);
    const samplePostsReplies = postReplies.map((post) => {
      return {
        ...post,
        postedBy: getRandomItem(createdUsers),
        replyTo: getRandomItem(allPosts),
      };
    });
    const replyPosts = await Posts.insertMany(samplePostsReplies);
    const retweetData = await Posts.find().limit(20);
    async function store(retweet) {
      const user = getRandomItem(createdUsers);
      repost = await Post.create({
        postedBy: user._id,
        retweetData: retweet._id,
      });
    }
    for (let i = 0; i < retweetData.length; i++) {
      const retweet = retweetData[i];
      const user = getRandomItem(createdUsers);
      let data = {
        retweetData: retweet,
        postedBy: user._id,
      };
      const repost = await Posts.create(data);
      await User.findByIdAndUpdate(
        user._id,
        {
          addToSet: { retweets: repost._id },
        },
        { new: true },
      );
      await Posts.findByIdAndUpdate(
        retweet._id,
        {
          addToSet: { retweetUsers: user._id },
        },
        { new: true },
      );
    }
    for (let i = 0; i < allPosts.length; i++) {
      const post = allPosts[i];
      let userLikes = [
        myUser._id,
        getRandomItem(createdUsers)._id,
        getRandomItem(createdUsers)._id,
        getRandomItem(createdUsers)._id,
      ];
      const likePost = await Posts.findByIdAndUpdate(
        post._id,
        {
          $addToSet: {
            likes: { $each: userLikes },
          },
        },
        { new: true },
      );
    }
    for (let i = 0; i < createdUsers.length; i++) {
      const logInUser = createdUsers[i];
      let ids = [
        getRandomItem(createdUsers)._id,
        getRandomItem(createdUsers)._id,
        getRandomItem(createdUsers)._id,
      ];
      const currentUser = await User.findByIdAndUpdate(logInUser._id, {
        $addToSet: { following: { $each: ids } },
      });
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const followingUser = await User.findByIdAndUpdate(id, {
          $addToSet: { followers: logInUser._id },
        });
      }
    }

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
const importUsers = async () => {
  try {
    await User.deleteMany();

    await User.insertMany(users);

    console.log('Users Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
const detroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  detroyData();
} else if (process.argv[2] === '-u') {
  importUsers();
} else {
  importData();
}
