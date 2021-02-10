import React from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';

const Header = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  //HANDLERS
  const logoutHandler = () => {
    dispatch(logout());
  };
  //HTML CONDITIONALS
  const loggedHTMl = (
    <NavDropdown title={userInfo ? userInfo.name : ''} id='username'>
      <LinkContainer to='/profile'>
        <NavDropdown.Item>Profile</NavDropdown.Item>
      </LinkContainer>
      <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
    </NavDropdown>
  );
  const adminMenuHTMl = (
    <NavDropdown title='Admin' id='adminmenu'>
      <LinkContainer to='/admin/userlist'>
        <NavDropdown.Item>Users</NavDropdown.Item>
      </LinkContainer>
    </NavDropdown>
  );

  const guestHTML = (
    <LinkContainer to='/login'>
      <Nav.Link>
        <i className='fas fa-user'></i> Sign In
      </Nav.Link>
    </LinkContainer>
  );

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Starter</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className='ml-auto'>
              {userInfo ? loggedHTMl : guestHTML}
              {userInfo && userInfo.isAdmin && adminMenuHTMl}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
