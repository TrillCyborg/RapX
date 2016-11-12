import {
  app as appTypes,
  auth as authTypes,
} from '../actions/Types';

const initAppState = {
  loginLoading: false,
  loggedIn: false,
  loginError: '',
  registered: null,
  battleConnectionInfo: '',
  disableChangeMicButton: false,
};

export default function App(state = initAppState, action) {
  switch (action.type) {
    case authTypes.login:
      return {
        ...state,
        loginError: '',
        loginLoading: true,
      };
    case authTypes.loginSuccess:
      return {
        ...state,
        registered: action.value.isRegistered,
        loggedIn: true,
        loginLoading: false,
      };
    case authTypes.loginFail:
      return {
        ...state,
        loginFail: 'Authentication Error',
        loginLoading: false,
      };
    case authTypes.logoutSuccess:
      return {
        ...state,
        loggedIn: false,
      };
    case appTypes.setBattleConnectionInfo:
      return {
        ...state,
        battleConnectionInfo: action.value,
      };
    case appTypes.setDisableChangeMicButton:
      return {
        ...state,
        disableChangeMicButton: action.value,
      };
    default:
      return state;
  }
}
