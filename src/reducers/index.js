import { combineReducers } from 'redux';
import Example from './Example';
import User from './User';
import App from './App';
import Temp from './Temp';

export default combineReducers({
  example: Example,
  user: User,
  app: App,
  temp: Temp,
});
