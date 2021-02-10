import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { hideFooter } from '../actions/pageActions';
import { register } from '../actions/userActions';

const RegisterScreen = ({ location, history }) => {
  //Get State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');

  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;
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
    //DISPATCH REGISTER
    if (password !== passwordConf) {
      setMessage('Passwords do not match');
    } else {
      dispatch(
        register({
          firstName,
          lastName,
          username,
          email,
          password,
          passwordConf,
        }),
      );
    }
  };
  return (
    <div className='myCenter'>
      <div className='myWrapper'>
        <div className='loginContainer'>
          <h1>Register</h1>
          {message && <Message variant='danger'>{message}</Message>}
          {error && <Message variant='danger'>{error}</Message>}
          {loading && <Loader />}
          <form method='post' onSubmit={submitHandler}>
            <input
              type='text'
              name='firstName'
              placeholder='First name'
              value={firstName}
              required=''
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type='text'
              name='lastName'
              placeholder='Last name'
              value={lastName}
              required=''
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type='text'
              name='username'
              placeholder='Username'
              value={username}
              required=''
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={email}
              required=''
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              value={password}
              required=''
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type='password'
              name='passwordConf'
              placeholder='Confirm password'
              required=''
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
            />
            <input type='submit' value='Login'></input>
          </form>
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Already have an account? Login here.
          </Link>
        </div>
      </div>
    </div>
    // <FormContainer>
    //   <h1>Sign UP</h1>
    //   {message && <Message variant='danger'>{message}</Message>}
    //   {error && <Message variant='danger'>{error}</Message>}
    //   {loading && <Loader />}
    //   <Form onSubmit={submitHandler}>
    //     <Form.Group controlId='name'>
    //       <Form.Label>Name</Form.Label>
    //       <Form.Control
    //         type='name'
    //         placeholder='Enter name'
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Form.Group controlId='email'>
    //       <Form.Label>Email Address</Form.Label>
    //       <Form.Control
    //         type='email'
    //         placeholder='Enter email'
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Form.Group controlId='password'>
    //       <Form.Label>Password</Form.Label>
    //       <Form.Control
    //         type='password'
    //         placeholder='Enter password'
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Form.Group controlId='confirmPassword'>
    //       <Form.Label>Confirm Password</Form.Label>
    //       <Form.Control
    //         type='password'
    //         placeholder='Confirm password'
    //         value={confirmPassword}
    //         onChange={(e) => setConfirmPassword(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Button type='submit' variant='primary'>
    //       Register
    //     </Button>
    //   </Form>
    //   <Row className='py-3'>
    //     <Col>
    //       Have an Account?{' '}
    //       <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
    //         Login
    //       </Link>
    //     </Col>
    //   </Row>
    // </FormContainer>
  );
};

export default RegisterScreen;
