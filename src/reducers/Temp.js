import { temp as tempTypes } from '../actions/Types';

const initTempState = {
  user: {
    username: '',
    name: '',
    bio: '',
    picUrl: '',
  },
};

const updateUser = (state, action) => {
  switch (action.type) {
    case tempTypes.setTempName:
      return {
        ...state,
        name: action.value,
      };
    case tempTypes.setTempBio:
      return {
        ...state,
        bio: action.value,
      };
    case tempTypes.setTempUsername:
      return {
        ...state,
        username: action.value,
      };
    case tempTypes.setTempProfilePicUrl:
      return {
        ...state,
        picUrl: action.value,
      };
    default:
      return state;
  }
};

export default function Temp(state = initTempState, action) {
  switch (action.type) {
    case tempTypes.reset:
      return initTempState;
    case tempTypes.resetTempUser:
      return {
        ...state,
        user: initTempState.user,
      };
    case tempTypes.setTempName:
      return { ...state, user: updateUser(state.user, action) };
    case tempTypes.setTempBio:
      return { ...state, user: updateUser(state.user, action) };
    case tempTypes.setTempUsername:
      return { ...state, user: updateUser(state.user, action) };
    case tempTypes.setTempProfilePicUrl:
      return { ...state, user: updateUser(state.user, action) };
    default:
      return state;
  }
}
