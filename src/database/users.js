import firebase from 'firebase';
import Store from '../store/Store';
import { setRegistered } from '../actions';

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
