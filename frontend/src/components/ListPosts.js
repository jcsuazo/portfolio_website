import React from 'react';
import Post from '../components/Post';

const ListPosts = ({ posts, history }) => {
  // HANDELERS

  return (
    <>
      {posts &&
        posts.map((post) => (
          <Post history={history} key={post._id} post={post} />
        ))}
    </>
  );
};

export default ListPosts;
