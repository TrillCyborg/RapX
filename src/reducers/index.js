import { combineReducers } from 'redux';
import Example from './Example';
import User from './User';
import App from './App';
import Temp from './Temp';
import WebRTC from './WebRTC';

export default combineReducers({
  example: Example,
  user: User,
  app: App,
  temp: Temp,
  webRTC: WebRTC,
});
