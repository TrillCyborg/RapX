import { combineReducers } from 'redux';
import User from './User';
import App from './App';
import Temp from './Temp';
import WebRTC from './WebRTC';

export default combineReducers({
  user: User,
  app: App,
  temp: Temp,
  webRTC: WebRTC,
});
