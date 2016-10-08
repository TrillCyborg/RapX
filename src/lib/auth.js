import firebase from 'firebase';
import { AccessToken } from 'react-native-fbsdk';
import Store from '../store/Store';
import { isUserRegistered, getUserOnce } from '../database/users';
import { setCurrentUserData } from '../lib/users';
import {
  setFbAccessToken,
  toggleLoggedIn,
  setUsername,
  setProfilePicUrl,
  setUid,
} from '../actions';

const initLogin = (callback) => {
  let fbLoggedIn = false;
  return AccessToken.getCurrentAccessToken()
    .then((data) => {
      if (data) {
        Store.dispatch(setFbAccessToken(data.accessToken));
        fbLoggedIn = true;
      }
    })
    .then(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        unsubscribe();
        if (user && fbLoggedIn) {
          Store.dispatch(setUid(user.uid));
          Store.dispatch(setUsername(user.displayName));
          Store.dispatch(setProfilePicUrl(user.photoURL));
          Store.dispatch(toggleLoggedIn());
          const unsubscribeStore = Store.subscribe(() => {
            callback();
          });
          isUserRegistered(user.uid, (isRegistered) => {
            if (isRegistered) {
              getUserOnce(user.uid, setCurrentUserData);
            }
            unsubscribeStore();
          });
        } else if (user) {
          signOut();
          callback();
        } else {
          callback();
        }
      });
    })
    .catch((error) => {
      console.log('ERROR', error);
    });
};

const signOut = () => firebase.auth().signOut().catch(error => console.log('ERROR', error));

export {
  initLogin,
  signOut,
};
