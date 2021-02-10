import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Meta from '../components/Meta';
import SideBar from '../components/SideBar';
import { getPostDetails } from '../actions/postActions';
import Loader from '../components/Loader';
import Post from '../components/Post';
const PostDetailsScreen = ({ match, history }) => {
  const dispatch = useDispatch();
  const id = match.params.id;

  const createPost = useSelector((state) => state.createPost);
  const { post: postChanges } = createPost;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const postDetails = useSelector((state) => state.postDetails);
  const { loading, post, success } = postDetails;

  const likePost = useSelector((state) => state.likePost);
  const { likedPost } = likePost;

  const retweetedPost = useSelector((state) => state.retweetedPost);
  const { retweetePost } = retweetedPost;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
    dispatch(getPostDetails(id));
  }, [dispatch, id, history, userInfo, postChanges, likedPost, retweetePost]);

  function showPostDetails() {
    return (
      <div className='wrapper'>
        <div className='row row-full'>
          <div className='col-2'>
            <SideBar history={history} />
          </div>
          <div className='mainSectionContainer col-10 col-md-8 col-lg-6'>
            <div className='titleContainer'>
              <h1>View Post</h1>
            </div>
            {/* {userInfo && <CreatePostForm userLoggedIn={userInfo} />} */}
            {loading ? (
              <Loader />
            ) : (
              success &&
              (post.replyTo !== undefined ? (
                <>
                  <Post history={history} post={post.replyTo} />
                  <Post
                    history={history}
                    post={post.postData}
                    largeFont={true}
                  />
                  {post.replies &&
                    post.replies.map((reply) => (
                      <Post key={reply._id} history={history} post={reply} />
                    ))}
                </>
              ) : (
                <>
                  <Post
                    history={history}
                    post={post.postData}
                    largeFont={true}
                  />
                  {post.replies &&
                    post.replies.map((reply) => (
                      <Post key={reply._id} history={history} post={reply} />
                    ))}
                </>
              ))
            )}
          </div>
          <div className='d-none d-md-block col-md-2 col-lg-4 bg-info'>
            <p>third column</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Meta />
      {showPostDetails()}
    </>
  );
};

export default PostDetailsScreen;
