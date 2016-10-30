import { app as appTypes } from '../actions/Types';

const initAppState = {
  loggedIn: false,
  registered: null,
  followsTitle: '',
};

export default function App(state = initAppState, action) {
  switch (action.type) {
    case appTypes.toggleLoggedIn:
      return {
        ...state,
        loggedIn: !state.loggedIn,
      };
    case appTypes.setRegistered:
      return {
        ...state,
        registered: action.value,
      };
    case appTypes.setFollowsTitle:
      return {
        ...state,
        followsTitle: action.value,
      };
    default:
      return state;
  }
}
