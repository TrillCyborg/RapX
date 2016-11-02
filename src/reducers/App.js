import { app as appTypes } from '../actions/Types';

const initAppState = {
  loggedIn: false,
  registered: null,
  battleConnectionInfo: '',
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
    case appTypes.setBattleConnectionInfo:
      return {
        ...state,
        battleConnectionInfo: action.value,
      };
    default:
      return state;
  }
}
