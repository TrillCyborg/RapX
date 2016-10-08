import { temp } from './Types';

const reset = () => ({ type: temp.reset });
const resetTempUser = () => ({ type: temp.resetTempUser });
const setTempName = name => ({ type: temp.setTempName, value: name });
const setTempUsername = username => ({ type: temp.setTempUsername, value: username });
const setTempProfilePicUrl = picUrl => ({ type: temp.setTempProfilePicUrl, value: picUrl });

export {
  reset,
  resetTempUser,
  setTempName,
  setTempUsername,
  setTempProfilePicUrl,
};
