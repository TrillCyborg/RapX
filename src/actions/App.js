import { app } from './Types';

const toggleLoggedIn = () => ({ type: app.toggleLoggedIn });
const setRegistered = bool => ({ type: app.setRegistered, value: bool });
const setFollowsTitle = title => ({ type: app.setFollowsTitle, value: title });

export {
  toggleLoggedIn,
  setRegistered,
  setFollowsTitle,
};
