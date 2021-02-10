import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  likeAPost,
  retweetAPost,
  createAPost,
  deletePost,
} from '../actions/postActions';
import { Button, Modal } from 'react-bootstrap';
const Post = ({ post, isModel = false, history, largeFont = false }) => {
  const dispatch = useDispatch();

  const [modelContent, setModelContent] = useState('');
  const [replyShow, setReplyShow] = useState(false);
  const [deletePostShow, setDeletePostShow] = useState(false);
  const [modalPost, setmodalPost] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  //HELPER
  function isRetweet(post) {
    return post.retweetData !== undefined && post.retweetData !== null;
  }
  const handleClose = (type) => {
    switch (type) {
      case 'reply':
        setReplyShow(false);
        break;
      case 'deletePost':
        setDeletePostShow(false);
        break;

      default:
        setReplyShow(false);
        break;
    }
    setmodalPost(null);
  };

  // HANDELERS
  function likePostHandeler(PostId) {
    dispatch(likeAPost(PostId));
  }
  function retweetPostHandeler(post) {
    if (isRetweet(post)) {
      dispatch(retweetAPost(post.retweetData._id));
    } else {
      dispatch(retweetAPost(post._id));
    }
  }
  function postHandeler(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'BUTTON' && e.target.nodeName !== 'A') {
      history.push(`/post/${post._id}`);
    }
  }

  function toogleModal(post, type) {
    setmodalPost(post);
    switch (type) {
      case 'reply':
        setReplyShow(true);

        break;
      case 'deletePost':
        setDeletePostShow(true);
        break;

      default:
        setReplyShow(true);
        break;
    }
  }
  function submitHandler(e, type) {
    e.preventDefault();
    switch (type) {
      case 'reply':
        dispatch(
          createAPost({
            content: modelContent,
            replyTo: modalPost._id,
            isReply: true,
          }),
        );
        setReplyShow(false);
        break;
      case 'deletePost':
        dispatch(deletePost(modalPost._id));
        setDeletePostShow(false);
        break;

      default:
        setReplyShow(false);
        break;
    }
  }
  // HTML

  const deletePostButton = (
    <button onClick={() => toogleModal(post, 'deletePost')}>
      <i className='fas fa-times'></i>
    </button>
  );

  const replyModal = (
    <Modal show={replyShow} onHide={() => handleClose('reply')}>
      <form onSubmit={(e) => submitHandler(e, 'reply')}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalPost && <Post post={modalPost} isModel={true} />}
          <div className='postFormContainer'>
            <div className='userImageContainer'>
              <img src={userInfo.profilePic} alt="User's profile" />
            </div>
            <div className='textareaContainer'>
              <textarea
                id='replyTextarea'
                placeholder="Wha's happening?"
                onChange={(e) => setModelContent(e.target.value)}
              ></textarea>
              <div className='buttonsContainer'></div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => handleClose('reply')}>
            Close
          </Button>
          <Button
            type='submit'
            id='submitReplyButton'
            style={{
              background: '#1fa2f1',
              border: 'none',
              borderRadius: '40px',
              padding: '7px 15px',
            }}
            disabled={modelContent.trim() === ''}
          >
            Reply
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
  const deletePostModal = (
    <Modal show={deletePostShow} onHide={() => handleClose('deletePost')}>
      <form onSubmit={(e) => submitHandler(e, 'deletePost')}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Post?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalPost && <Post post={modalPost} isModel={true} />}
          <div className='postFormContainer'>
            <div className='align-content-center align-middle d-flex h-100 justify-content-center w-100'>
              <p className='deletePostMessage font-weight-bold m-0 text-danger'>
                Are you sure that you want to delete this post?
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => handleClose('deletePost')}>
            Close
          </Button>
          <Button
            type='submit'
            variant='danger'
            id='submitReplyButton'
            style={{
              border: 'none',
              borderRadius: '40px',
              padding: '7px 15px',
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );

  return (
    <>
      {replyModal}
      {deletePostModal}
      <div
        className={`post ${largeFont ? 'largeFont' : ''}`}
        key={post._id}
        onClick={(e) => postHandeler(e)}
      >
        <div className='postActionContainer'>
          {isRetweet(post) && (
            <span>
              <i className='fas fa-retweet'></i>
              Retweeted by{' '}
              <Link
                to={`/profile/${isRetweet(post) && post.postedBy.username}`}
                className='displayName'
              >
                @{post.postedBy.username}
              </Link>
            </span>
          )}
        </div>
        <div className='mainContentContainer'>
          <div className='userImageContainer'>
            <img src={post.postedBy.profilePic} alt='profile' />
          </div>
          <div className='postContenteContainer'>
            <div className='header'>
              <Link
                to={`/profile/${post.postedBy.username}`}
                className='displayName'
              >
                {post.postedBy.firstName} {post.postedBy.lastName}
              </Link>
              <span className='username'>@{post.postedBy.username}</span>
              <span className='date'>{post.createdAt}</span>
              {post.postedBy._id === userInfo._id &&
                !isModel &&
                deletePostButton}
            </div>
            {post.replyTo && (
              <div className='replyFlag'>
                {post.replyTo.postedBy && (
                  <>
                    <span>Replaying to </span>
                    <Link
                      to={`/profile/${post.replyTo.postedBy.username}`}
                      className='displayName'
                    >
                      @{post.replyTo.postedBy.username}
                    </Link>
                  </>
                )}
              </div>
            )}
            <div className='postBody'>
              <span>
                {isRetweet(post) ? post.retweetData.content : post.content}
              </span>
            </div>
            {!isModel && (
              <div className='postFooter'>
                <div className='postButtonContainer'>
                  <button
                    data-toggle='modal'
                    data-target='#replyModal'
                    onClick={() => toogleModal(post, 'reply')}
                  >
                    <i className='far fa-comment'></i>
                  </button>
                </div>
                <div className='postButtonContainer green'>
                  <button
                    onClick={() => retweetPostHandeler(post)}
                    className={`retweetButton ${
                      isRetweet(post)
                        ? post.retweetData.retweetUsers.includes(userInfo._id)
                          ? 'active'
                          : ''
                        : post.retweetUsers.includes(userInfo._id)
                        ? 'active'
                        : ''
                    }`}
                  >
                    <i className='fas fa-retweet'></i>
                    <span>
                      {isRetweet(post)
                        ? post.retweetData.retweetUsers.length || ''
                        : post.retweetUsers.length || ''}
                    </span>
                  </button>
                </div>
                <div className='postButtonContainer red'>
                  <button
                    onClick={() => likePostHandeler(post._id)}
                    className={`likeButton ${
                      post.likes.includes(userInfo._id) ? 'active' : ''
                    }`}
                  >
                    <i className='far fa-heart'></i>
                    <span>{post.likes.length || ''}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
