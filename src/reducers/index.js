import { combineReducers } from 'redux';
import Example from './Example';
import User from './User';

export default combineReducers({
  example: Example,
  user: User,
});
