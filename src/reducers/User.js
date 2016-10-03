import { user as userTypes } from '../actions/Types';

const initUserState = {
  uid: '',
  name: '',
  username: '',
  picUrl: '',
  fbAccessToken: '',
};

export default function User(state = initUserState, action) {
  switch (action.type) {
    case userTypes.setUid:
      return {
        ...state,
        uid: action.value,
      };
    case userTypes.setName:
      return {
        ...state,
        name: action.value,
      };
    case userTypes.setUsername:
      return {
        ...state,
        username: action.value,
      };
    case userTypes.setProfilePicUrl:
      return {
        ...state,
        picUrl: action.value,
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
