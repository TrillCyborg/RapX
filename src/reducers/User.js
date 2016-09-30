import { user as userTypes } from '../actions/Types';

const initUserState = {
  fbAccessToken: '',
  loggedIn: false,
};

export default function Example(state = initUserState, action) {
  switch (action.type) {
    case userTypes.toggleLoggedIn:
      return {
        ...state,
        loggedIn: !state.loggedIn,
      };
    case userTypes.setFbAccessToken:
      return {
        ...state,
        fbAccessToken: action.value,
      };
    default:
      return state;
  }
}
