import Store from '../store/Store';
import { setName, setUsername, setProfilePicUrl } from '../actions';
import { updateUser as updateUserDB } from '../database/users';
import { updateProfile } from './auth';

const setCurrentUserData = (user) => {
  const { name, username, picUrl } = user.val();
  Store.dispatch(setName(name));
  Store.dispatch(setUsername(username));
  Store.dispatch(setProfilePicUrl(picUrl));
};

const updateUser = (uid, updates) => updateUserDB(uid, updates)
  .then(() => {
    if (updates.username || updates.email || updates.picUrl) {
      return updateProfile({
        username: updates.username,
        email: updates.email,
        picUrl: updates.picUrl,
      });
    }
    return true;
  });

export {
  setCurrentUserData,
  updateUser,
};
