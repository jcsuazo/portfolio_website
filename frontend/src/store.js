import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  userByUsernameReducer,
} from './reducers/userReducers';
import {
  createPostReducer,
  listPostsReducer,
  likePostReducer,
  retweetedPostReducer,
  postDetailsReducer,
  postDeleteReducer,
} from './reducers/postReducer';
import { toggleFooterReducer } from './reducers/pageReducer';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  userByUsername: userByUsernameReducer,
  toggleFooter: toggleFooterReducer,
  createPost: createPostReducer,
  listPosts: listPostsReducer,
  likePost: likePostReducer,
  retweetedPost: retweetedPostReducer,
  postDetails: postDetailsReducer,
  postDelete: postDeleteReducer,
});

//Set user info to the state if it is on local storage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;
const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
