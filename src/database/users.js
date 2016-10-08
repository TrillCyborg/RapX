import firebase from 'firebase';
import Store from '../store/Store';
import { setRegistered } from '../actions';

// "uid1": {
//   "username": "trillcyborg",
//   "name": "Supa Jaiyan",
//   "picUrl": "https://url.com/pic1",
//   "email": "jason@rapx.com",
//   "bio": "someting about a bio",
//   "fbid": "9871264982634",
//   "gender": "male",
//   "birthday": "1996-04-07",
//   "age_range": "18-21",
//   "fbAccessToken": "jfnl89342hof8h583rjefwe",
//   "isRegistered": true,
//   "createdAt": 1475442341566,
//   "updatedAt": 1475442342328,
// }

const createNewUser = ({ uid, email, fbAccessToken, fbid }) => {
  return firebase.database().ref(`users/${uid}`).set({
    email,
    fbAccessToken,
    fbid,
    isRegistered: false,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  });
};

// TODO: check map function to make sure only allowed fields are here
const updateUser = (uid, updates) => {
  const params = {
    ...updates,
    updatedAt: firebase.database.ServerValue.TIMESTAMP,
  };
  return firebase.database().ref(`users/${uid}`).update(params);
};

const isUserRegistered = (uid, callback) => {
  firebase.database().ref(`users/${uid}/isRegistered`)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        Store.dispatch(setRegistered(true));
      } else {
        Store.dispatch(setRegistered(false));
      }
      if (callback) {
        callback(snapshot.val());
      }
    });
};

const getUser = (uid, callback) => {
  firebase.database().ref(`users/${uid}`)
    .on('value', callback);
};

const getUserOnce = uid => firebase.database().ref(`users/${uid}`).once('value');

const registerUser = (uid, userData) => {
  const params = userData;
  params.isRegistered = true;
  params.updatedAt = firebase.database.ServerValue.TIMESTAMP;
  return firebase.database().ref(`users/${uid}`).set(params)
    .then(() => firebase.auth().currentUser.updateProfile({
      displayName: userData.username,
      photoURL: userData.picUrl,
    }));
};

export {
  createNewUser,
  updateUser,
  isUserRegistered,
  getUser,
  getUserOnce,
  registerUser,
};
