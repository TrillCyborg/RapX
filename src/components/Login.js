import React, { Component, PropTypes } from 'react';
import firebase from 'firebase';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken } from 'react-native-fbsdk';
import {
  setFbAccessToken,
  toggleLoggedIn,
  setUsername,
  setProfilePicUrl,
  setUid,
} from '../actions';
import { createNewUser, isUserRegistered } from '../database/users';
import FacebookLoginButton from './FacebookLoginButton';

// TODO all login / logout functions need to be moved to a lib and imported

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

class Login extends Component {
  constructor(props) {
    super(props);
    this.onLoginFinished = this.onLoginFinished.bind(this);
    this.onLogoutFinished = this.onLogoutFinished.bind(this);
    this.handleFbAccessToken = this.handleFbAccessToken.bind(this);
    this.checkLoginState = this.checkLoginState.bind(this);
  }

  onLoginFinished(error, result) {
    if (error) {
      console.log(`Login failed with error: ${result.error}`);
    } else if (result.isCancelled) {
      console.log('Login was cancelled');
    } else {
      console.log('Login was successful with permissions:', result);
      AccessToken.getCurrentAccessToken()
        .then(this.handleFbAccessToken);
    }
  }

  onLogoutFinished() {
    this.props.toggleLoggedIn();
    // TODO reset all state
    this.checkLoginState();
  }

  handleFbAccessToken(data) {
    console.log('ACCESS TOKEN DATA', data);
    this.props.setFbAccessToken(data.accessToken.toString());
    this.checkLoginState({
      accessToken: data.accessToken.toString(),
      userID: data.userID.toString(),
    });
  }

  checkLoginState(accessToken) {
    const setUserData = () => {
      const { displayName, photoURL, uid, email } = firebase.auth().currentUser;
      this.props.setUid(uid);
      this.props.setProfilePicUrl(photoURL);
      this.props.toggleLoggedIn();
      isUserRegistered(uid, (isRegistered) => {
        if (isRegistered) {
          this.props.setUsername(displayName);
          Actions.main({ type: 'reset' });
        } else {
          createNewUser({
            uid,
            email,
            fbAccessToken: accessToken.accessToken,
            fbid: accessToken.userID,
          });
          Actions.register();
        }
      })
    };

    if (accessToken) {
      const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        if (!isUserEqual(accessToken, firebaseUser)) {
          // Firebase and Facebook credentials out of sync or Firebase not authed
          const credential = firebase.auth.FacebookAuthProvider.credential(
              accessToken.accessToken);
          firebase.auth().signInWithCredential(credential).catch((error) => {
            console.log('ERROR', error);
          }).then(() => {
            console.log('CURRENT USER', firebase.auth().currentUser);
            setUserData();
          });
        } else {
          // User already logged in with Firebase
          setUserData();
        }
      });
    } else {
      // User signing out of Firebase
      firebase.auth().signOut().then(() => {
        Actions.welcome({ type: 'reset' });
      }, (error) => {
        console.log('ERROR', error);
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <FacebookLoginButton
          onLoginFinished={this.onLoginFinished}
          onLogoutFinished={this.onLogoutFinished}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
};

Login.propTypes = {
  setFbAccessToken: PropTypes.func.isRequired,
  toggleLoggedIn: PropTypes.func.isRequired,
  setUid: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setProfilePicUrl: PropTypes.func.isRequired,
};

export default connect(null, {
  setFbAccessToken,
  toggleLoggedIn,
  setUid,
  setUsername,
  setProfilePicUrl,
})(Login);
