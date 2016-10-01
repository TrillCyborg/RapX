import React, { Component, PropTypes } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { setFbAccessToken, toggleLoggedIn } from '../actions/User';

// TODO all login / logout functions need to be moved to a lib and imported
// Component must be documented and annoying comments removed

function checkLoginState(accessToken) {
  if (accessToken) {
    const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(accessToken, firebaseUser)) {
        // Build Firebase credential with the Facebook auth token.
        const credential = firebase.auth.FacebookAuthProvider.credential(
            accessToken.accessToken);
        // Sign in with the credential from the Facebook user.
        firebase.auth().signInWithCredential(credential).catch((/* error */) => {
          // // Handle Errors here.
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // // The email of the user's account used.
          // const email = error.email;
          // // The firebase.auth.AuthCredential type that was used.
          // const credential = error.credential;
          // // ...
        }).then(() => {
          console.log('CURRENT USER', firebase.auth().currentUser);
          Actions.main({ type: 'reset' });
        });
      } else {
        // User is already signed-in Firebase with the correct user.
      }
    });
  } else {
    // User is signed-out of Facebook.
    firebase.auth().signOut().then(() => {
      Actions.login({ type: 'reset' });
    }, (/* error */) => {
      // An error happened.
    });
  }
}

function isUserEqual(facebookAuthResponse, firebaseUser) {
  if (firebaseUser) {
    const providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i += 1) {
      if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
          providerData[i].uid === facebookAuthResponse.userID) {
        // We don't need to re-auth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

class FacebookLoginButton extends Component {
  constructor(props) {
    super(props);
    this.onLoginFinished = this.onLoginFinished.bind(this);
    this.onLogoutFinished = this.onLogoutFinished.bind(this);
  }

  onLoginFinished(error, result) {
    if (error) {
      console.log(`Login failed with error: ${result.error}`);
    } else if (result.isCancelled) {
      console.log('Login was cancelled');
    } else {
      console.log('Login was successful with permissions:', result);
      AccessToken.getCurrentAccessToken()
        .then((data) => {
          console.log('ACCESS TOKEN DATA', data);
          this.props.setFbAccessToken(data.accessToken.toString());
          this.props.toggleLoggedIn();
          checkLoginState({
            accessToken: data.accessToken.toString(),
            userID: data.userID.toString(),
          });
        }
      );
    }
  }

  onLogoutFinished() {
    this.props.toggleLoggedIn();
    this.props.setFbAccessToken('');
    checkLoginState();
  }

  render() {
    return (
      <LoginButton
        readPermissions={['public_profile', 'email', 'user_friends']}
        onLoginFinished={this.onLoginFinished}
        onLogoutFinished={this.onLogoutFinished}
      />
    );
  }
}

FacebookLoginButton.propTypes = {
  setFbAccessToken: PropTypes.func.isRequired,
  toggleLoggedIn: PropTypes.func.isRequired,
};

export default connect(null, { setFbAccessToken, toggleLoggedIn })(FacebookLoginButton);
