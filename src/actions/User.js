import { user } from './Types';

const setFbAccessToken = fbAccessToken => ({ type: user.setFbAccessToken, value: fbAccessToken });
const toggleLoggedIn = () => ({ type: user.toggleLoggedIn });

export {
  setFbAccessToken,
  toggleLoggedIn,
};
