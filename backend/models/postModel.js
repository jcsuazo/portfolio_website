import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    pinned: Boolean,
    isReply: {
      type: Boolean,
      required: true,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    retweetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    retweetData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', postSchema);

export default Post;
