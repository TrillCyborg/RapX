import {
  updateUser as updateUserDB,
  getUserOnce as getUserOnceDB,
  registerUser as registerUserDB,
} from '../database/users';
import { updateProfile } from './auth';

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

const getUserOnce = getUserOnceDB;
const registerUser = registerUserDB;

export {
  updateUser,
  getUserOnce,
  registerUser,
};
