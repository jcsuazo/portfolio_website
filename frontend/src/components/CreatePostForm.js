import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAPost } from '../actions/postActions';
const CreatePostForm = ({ userLoggedIn }) => {
  const dispatch = useDispatch();
  //Get State
  const createPost = useSelector((state) => state.createPost);
  const { success } = createPost;

  const [content, setContent] = useState('');
  useEffect(() => {
    if (success) {
      setContent('');
      document.getElementById('postTextarea').value = '';
    }
  }, [success]);

  //Handeler
  function submitHandler(e) {
    e.preventDefault();
    dispatch(createAPost({ content }));
  }

  return (
    <div className='postFormContainer'>
      <div className='userImageContainer'>
        <img src={userLoggedIn.profilePic} alt='Users profile' />
      </div>
      <div className='textareaContainer'>
        <form onSubmit={submitHandler}>
          <textarea
            name='content'
            id='postTextarea'
            placeholder="Wha's happening?"
            defaultValue={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className='buttonsContainer'>
            <button
              type='submit'
              id='submitPostButton'
              disabled={content.trim() === ''}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
