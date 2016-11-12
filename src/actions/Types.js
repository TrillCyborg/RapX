const auth = {
  login: 'LOGIN',
  loginSuccess: 'LOGIN_SUCCESS',
  loginFail: 'LOGIN_FAIL',
  logout: 'LOGOUT',
  logoutSuccess: 'LOGOUT_SUCCESS',
};

const user = {
  login: 'LOGIN',
  setFbAccessToken: 'SET_FB_ACCESS_TOKEN',
  setUsername: 'SET_USERNAME',
  setProfilePicUrl: 'SET_PROFILE_PIC_URL',
  setUid: 'SET_UID',
  setName: 'SET_NAME',
  setBio: 'SET_BIO',
};

const app = {
  setBattleConnectionInfo: 'SET_BATTLE_CONNECTION_INFO',
  setDisableChangeMicButton: 'SET_DISABLE_CHANGE_MIC_BUTTON',
};

const temp = {
  reset: 'RESET_TEMP',
  resetTempUser: 'RESET_TEMP_USER',
  setTempName: 'SET_TEMP_NAME',
  setTempUsername: 'SET_TEMP_USERNAME',
  setTempBio: 'SET_TEMP_BIO',
  setTempProfilePicUrl: 'SET_TEMP_PROFILE_PIC_URL',
};

const webRTC = {
  setLocalStream: 'SET_LOCAL_STREAM',
  setPcPeer: 'SET_PC_PEER',
  setStatus: 'SET_STATUS',
  setRoomId: 'SET_ROOM_ID',
  setRemoteList: 'SET_REMOTE_LIST',
  setBattleRoomConnected: 'SET_BATTLE_ROOM_CONNECTED',
};

export {
  auth,
  user,
  app,
  temp,
  webRTC,
};
