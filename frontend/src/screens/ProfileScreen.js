import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Meta from '../components/Meta';
import SideBar from '../components/SideBar';
import { getUserByUsername } from '../actions/userActions';
import Loader from '../components/Loader';
import Post from '../components/Post';
import { Link } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';

const ProfileScreen = ({ match, history }) => {
  const dispatch = useDispatch();
  const [key, setKey] = useState('Posts');

  const username = match.params.username;

  const createPost = useSelector((state) => state.createPost);
  const { post: postChanges } = createPost;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const likePost = useSelector((state) => state.likePost);
  const { likedPost } = likePost;

  const retweetedPost = useSelector((state) => state.retweetedPost);
  const { retweetePost } = retweetedPost;

  const userByUsername = useSelector((state) => state.userByUsername);
  const {
    profileUser,
    loading,
    success: profileUserSuccess,
    error: profileUserError,
  } = userByUsername;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
    if (profileUserError) {
      history.push('/');
    }
    if (username) {
      dispatch(getUserByUsername(username));
    } else {
      history.push('/');
    }
  }, [
    dispatch,
    username,
    history,
    userInfo,
    postChanges,
    likedPost,
    retweetePost,
    profileUserError,
  ]);
  // HTML
  let isFollowing = true;
  const followButton = (
    <button
      className={`${isFollowing ? 'followButton following' : 'followButton'}`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
  function showPostDetails() {
    return (
      <div className='wrapper'>
        <div className='row row-full'>
          <div className='col-2'>
            <SideBar history={history} />
          </div>
          {loading ? (
            <Loader />
          ) : (
            profileUserSuccess && (
              <div className='mainSectionContainer col-10 col-md-8 col-lg-6'>
                <div className='titleContainer'>
                  <h1>Profile: {profileUser.user.username}</h1>
                </div>
                <div className='profileHeaderContainer'>
                  <div className='coverPhotoContainer'>
                    <div className='myUserImageContainer'>
                      <img
                        src={profileUser.user.profilePic}
                        alt='Users profile'
                      />
                    </div>
                  </div>
                  <div className='profileButtonsContainer'>
                    <Link
                      className='profuleButton myEnvelope'
                      to={`/messages/${profileUser.user._id}`}
                    >
                      <svg
                        className='myEnvelopeSize'
                        data-darkreader-inline-fill=''
                        data-darkreader-inline-stroke=''
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        ></path>
                      </svg>
                    </Link>
                    {followButton}
                  </div>
                  <div className='userDetailsContainer'>
                    <span className='displayName'>
                      {`${profileUser.user.firstName} ${profileUser.user.lastName}`}
                    </span>
                    <span className='username'>
                      {' '}
                      @{profileUser.user.username}
                    </span>
                    <span className='description'>
                      {' '}
                      {profileUser.user.description}
                    </span>
                    <div className='followersContainer'>
                      <Link
                        to={`/profile/${profileUser.user.username}/following`}
                      >
                        <span className='value'>0</span>
                        <span>Following</span>
                      </Link>
                      <Link
                        to={`/profile/${profileUser.user.username}/followers`}
                      >
                        <span className='value'>0</span>
                        <span>Followers</span>
                      </Link>
                    </div>
                  </div>
                  <div className='myTabsContainer'>
                    <Tabs
                      id='controlled-tab-example'
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                      defaultActiveKey='Posts'
                    >
                      <Tab eventKey='Posts' title='Posts'>
                        {loading ? (
                          <Loader />
                        ) : (
                          profileUser.posts.map((post) => (
                            <Post
                              history={history}
                              key={post._id}
                              post={post}
                            />
                          ))
                        )}
                      </Tab>
                      <Tab eventKey='Replies' title='Replies'>
                        {loading ? (
                          <Loader />
                        ) : (
                          profileUser.replyTo.map((post) => (
                            <Post
                              history={history}
                              key={post._id}
                              post={post}
                            />
                          ))
                        )}
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            )
          )}
          <div className='d-none d-md-block col-md-2 col-lg-4'>
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

export default ProfileScreen;
