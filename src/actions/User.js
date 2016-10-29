import { user } from './Types';

const setFbAccessToken = fbAccessToken => ({ type: user.setFbAccessToken, value: fbAccessToken });
const setUsername = username => ({ type: user.setUsername, value: username });
const setProfilePicUrl = url => ({ type: user.setProfilePicUrl, value: url });
const setUid = uid => ({ type: user.setUid, value: uid });
const setName = name => ({ type: user.setName, value: name });
const setBio = bio => ({ type: user.setBio, value: bio });

export {
  setFbAccessToken,
  setUsername,
  setProfilePicUrl,
  setUid,
  setName,
  setBio,
};
