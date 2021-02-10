import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Footer from './components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import PostDetailsScreen from './screens/PostDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
// import { showFooter } from './actions/pageActions';
const App = () => {
  const dispatch = useDispatch();
  const toggleFooter = useSelector((state) => state.toggleFooter);
  const { footer } = toggleFooter;

  useEffect(() => {
    // dispatch(showFooter());
  }, [dispatch]);
  return (
    <Router>
      <main className=''>
        <Route path='/login' component={LoginScreen} />
        <Route path='/post/:id' component={PostDetailsScreen} />
        <Route path='/register' component={RegisterScreen} />
        <Route path='/profile' component={ProfileScreen} exact />
        <Route path='/profile/:username' component={ProfileScreen} exact />
        <Route path='/admin/userlist' component={UserListScreen} />
        <Route path='/admin/user/:id/edit' component={UserEditScreen} />
        <Route path='/search/:keyword' component={HomeScreen} exact />
        <Route path='/page/:pageNumber' component={HomeScreen} exact />
        <Route
          path='/search/:keyword/page/:pageNumber'
          component={HomeScreen}
          exact
        />
        <Route path='/' component={HomeScreen} exact />
      </main>
      {footer && <Footer />}
    </Router>
  );
};

export default App;
