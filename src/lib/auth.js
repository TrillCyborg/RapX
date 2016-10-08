import firebase from 'firebase';
import { AccessToken } from 'react-native-fbsdk';
import Store from '../store/Store';
import { isUserRegistered, getUserOnce, createNewUser } from '../database/users';
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

const signIn = (callback) => {
  let fbAccessToken;
  function isUserEqual(facebookAuthResponse, firebaseUser) {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i += 1) {
        if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
            providerData[i].uid === facebookAuthResponse.userID) {
          return true; // We don't need to re-auth the Firebase connection.
        }
      }
    }
    return false;
  }
  function setUserData() {
    const { displayName, photoURL, uid, email } = getCurrentUser();
    Store.dispatch(setUid(uid));
    Store.dispatch(setProfilePicUrl(photoURL));
    Store.dispatch(toggleLoggedIn());
    isUserRegistered(uid, (isRegistered) => {
      if (isRegistered) {
        Store.dispatch(setUsername(displayName));
      } else {
        createNewUser({
          uid,
          email,
          fbAccessToken: fbAccessToken.accessToken,
          fbid: fbAccessToken.userID,
        });
      }
      callback();
    });
  }

  AccessToken.getCurrentAccessToken()
    .then((data) => {
      Store.dispatch(setFbAccessToken(data.accessToken));
      return {
        accessToken: data.accessToken.toString(),
        userID: data.userID.toString(),
      };
    })
    .then((accessToken) => {
      fbAccessToken = accessToken;
      const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        if (!isUserEqual(accessToken, firebaseUser)) {
          // Firebase and Facebook credentials out of sync or Firebase not authed
          const credential = firebase.auth.FacebookAuthProvider.credential(
              accessToken.accessToken);
          firebase.auth().signInWithCredential(credential).catch((error) => {
            console.log('ERROR', error);
          }).then(() => {
            console.log('CURRENT USER', getCurrentUser());
            setUserData();
          });
        } else {
          // User already logged in with Firebase
          setUserData();
        }
      });
    });
};

const signOut = () => firebase.auth().signOut().catch(error => console.log('ERROR', error));

const getCurrentUser = () => firebase.auth().currentUser;

export {
  initLogin,
  signOut,
  signIn,
  getCurrentUser,
};
