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
  firebase.database().ref(`users/${uid}`).set({
    email,
    fbAccessToken,
    fbid,
    isRegistered: false,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  });
};

const isUserRegistered = (uid, handler) => {
  firebase.database().ref(`users/${uid}/isRegistered`)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        Store.dispatch(setRegistered(true));
      } else {
        Store.dispatch(setRegistered(false));
      }
      if (handler) {
        handler(snapshot.val());
      }
    });
};

const getUserOnce = (uid, handler) => {
  firebase.database().ref(`users/${uid}`)
    .once('value')
    .then(handler);
};

const registerUser = (uid, userData) => {
  const params = userData;
  params.isRegistered = true;
  params.updatedAt = firebase.database.ServerValue.TIMESTAMP;
  firebase.database().ref(`users/${uid}`).set(params);
  firebase.auth().currentUser.updateProfile({
    displayName: userData.username,
    photoURL: userData.picUrl,
  })
  .then(() => {
    Store.dispatch(setRegistered(true));
  }, (error) => {
    console.log('ERROR', error);
  });
};

export {
  createNewUser,
  isUserRegistered,
  getUserOnce,
  registerUser,
};
