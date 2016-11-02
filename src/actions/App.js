import { app } from './Types';

const toggleLoggedIn = () => ({ type: app.toggleLoggedIn });
const setRegistered = bool => ({ type: app.setRegistered, value: bool });

export {
  toggleLoggedIn,
  setRegistered,
};
