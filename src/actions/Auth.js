import firebase from 'firebase';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { Actions } from 'react-native-router-flux';
import {
  isUserRegistered,
  getUserOnce,
  createNewUser,
} from '../database/users';
import { auth } from './Types';
import {
  setUsername,
  setName,
} from './';

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

const loginSuccess = (uid, photoURL, fbAccessToken, isRegistered) => ({
  type: auth.loginSuccess,
  value: { uid, picUrl: photoURL, fbAccessToken, isRegistered },
});
const loginFail = error => ({ type: auth.loginFail, value: error });
const login = () => {
  let fbAccessToken;
  return (dispatch) => {
    dispatch({ type: auth.login });
    LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends'])
      .then((result) => {
        if (result.isCancelled) {
          console.log('Login was cancelled');
          dispatch(loginFail('Login was cancelled'));
        } else {
          console.log('Login was successful with permissions:', result);
          AccessToken.getCurrentAccessToken()
            .then(data => ({
              accessToken: data.accessToken.toString(),
              userID: data.userID.toString(),
            }))
            .then((accessToken) => {
              fbAccessToken = accessToken;
              return new Promise((resolve, reject) => {
                const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
                  unsubscribe();
                  if (!isUserEqual(accessToken, firebaseUser)) {
                    // Firebase and Facebook credentials out of sync or Firebase not authed
                    const credential = firebase.auth.FacebookAuthProvider.credential(
                        accessToken.accessToken);
                    firebase.auth().signInWithCredential(credential)
                      .then(() => {
                        console.log('CURRENT USER', firebase.auth().currentUser);
                        resolve();
                      })
                      .catch(reject);
                  } else {
                    // User already logged in with Firebase
                    resolve();
                  }
                });
              });
            })
            .then(() => isUserRegistered(firebase.auth().currentUser.uid))
            .then((isRegistered) => {
              const { displayName, uid, email } = firebase.auth().currentUser;
              return isRegistered ? (
                  getUserOnce(uid)
                    .then((snapshot) => {
                      dispatch(setUsername(displayName));
                      dispatch(setName(snapshot.val().name));
                    }).then(() => isRegistered)
                ) : (
                  createNewUser({
                    uid,
                    email,
                    fbAccessToken: fbAccessToken.accessToken,
                    fbid: fbAccessToken.userID,
                  }).then(() => isRegistered)
                );
            })
            .then((isRegistered) => {
              const { uid, photoURL } = firebase.auth().currentUser;
              dispatch(loginSuccess(uid, photoURL, fbAccessToken.accessToken, isRegistered));
              if (isRegistered) {
                Actions.main();
              } else {
                Actions.register();
              }
            })
            .catch((error) => {
              console.log('LOGIN ERROR', error);
              dispatch(loginFail(error));
            });
        }
      })
      .catch((error) => {
        console.log('LOGIN ERROR', error);
        dispatch(loginFail(error));
      });
  };
};
const initLogin = (callback) => {
  let fbLoggedIn = false;
  let fbAccessToken;
  return (dispatch) => {
    AccessToken.getCurrentAccessToken()
      .then((data) => {
        if (data) {
          fbAccessToken = data;
          fbLoggedIn = true;
        }
      })
      .then(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          unsubscribe();
          if (user && fbLoggedIn) {
            isUserRegistered(firebase.auth().currentUser.uid).then((isRegistered) => {
              if (isRegistered) {
                getUserOnce(user.uid)
                  .then((snapshot) => {
                    dispatch(setName(snapshot.val().name));
                    dispatch(setUsername(user.displayName));
                  })
                  .then(() => {
                    dispatch(loginSuccess(
                      user.uid,
                      user.photoURL,
                      fbAccessToken.accessToken,
                      isRegistered
                    ));
                    callback();
                  });
              } else {
                logout();
                callback();
              }
            });
          } else if (user) {
            logout();
            callback();
          } else {
            callback();
          }
        });
      })
      .catch((error) => {
        console.log('ERROR', error);
        callback();
      });
  };
};
const logoutSuccess = () => ({ type: auth.logoutSuccess });
const logout = callback => (dispatch) => {
  firebase.auth().signOut()
    .then(() => {
      // TODO reset all state
      dispatch(logoutSuccess());
      callback();
    })
    .catch(error => console.log('ERROR', error));
};

export {
  login,
  initLogin,
  logout,
};
