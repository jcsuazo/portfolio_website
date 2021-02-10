import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { hideFooter } from '../actions/pageActions';
import { login } from '../actions/userActions';

const LoginScreen = ({ location, history }) => {
  //Get State
  const [logUserName, setEmail] = useState('');
  const [logPassword, setPassword] = useState('');
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  // Redirect
  let redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    dispatch(hideFooter());
    if (userInfo) {
      history.push(redirect);
    }
  }, [dispatch, history, userInfo, redirect]);

  //Handlers
  const submitHandler = (e) => {
    e.preventDefault();
    //DISPATCH LOGIN
    dispatch(login({ logUserName, logPassword }));
  };
  return (
    <div className='myCenter'>
      <div className='myWrapper'>
        <div className='loginContainer'>
          <h1>Login</h1>
          {error && <Message variant='danger'>{error}</Message>}
          {loading && <Loader />}
          <form method='post' onSubmit={submitHandler}>
            <input
              type='text'
              name='logUserName'
              placeholder='Username or email'
              value={logUserName}
              required=''
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              name='logPassword'
              placeholder='Password'
              value={logPassword}
              required=''
            />
            <input type='submit' value='Login'></input>
          </form>
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Need an account? Register here.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
