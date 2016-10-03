import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { AccessToken } from 'react-native-fbsdk';
import firebase from 'firebase';
import Store from './store/Store';
import {
  setFbAccessToken,
  toggleLoggedIn,
  setUsername,
  setProfilePicUrl,
  setUid,
} from './actions';
import { isUserRegistered } from './database/users';
import Routes from './Routes';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      finishInitFbData: false,
      finishInitFirebaseAuth: false,
      fbLoggedIn: false,
    };
    this.handleFbAccessToken = this.handleFbAccessToken.bind(this);
    this.handleFirebaseAuth = this.handleFirebaseAuth.bind(this);
  }

  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyBwTvt6DpDCcqlPaAN3ETqxpsFFhL8MlHk',
      authDomain: 'rapx-4dfa8.firebaseapp.com',
      databaseURL: 'https://rapx-4dfa8.firebaseio.com',
      storageBucket: 'rapx-4dfa8.appspot.com',
      messagingSenderId: '683961390118',
    });
    // TODO make redux thunk. Sync with firebase login
    AccessToken.getCurrentAccessToken()
      .then(this.handleFbAccessToken)
      .then(this.handleFirebaseAuth)
      .catch((error) => {
        console.log('ERROR', error);
      });
  }

  handleFbAccessToken(data) {
    if (data) {
      Store.dispatch(setFbAccessToken(data.accessToken));
      this.setState({ finishInitFbData: true, fbLoggedIn: true });
    } else {
      this.setState({ finishInitFbData: true });
    }
  }

  handleFirebaseAuth() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      if (user && this.state.fbLoggedIn) {
        Store.dispatch(setUid(user.uid));
        Store.dispatch(setUsername(user.displayName));
        Store.dispatch(setProfilePicUrl(user.photoURL));
        Store.dispatch(toggleLoggedIn());
        const unsubscribeStore = Store.subscribe(() => {
          this.setState({ finishInitFirebaseAuth: true });
        });
        isUserRegistered(user.uid, () => {
          unsubscribeStore();
        });
      } else if (user) {
        firebase.auth().signOut().catch(error => console.log('ERROR', error));
        this.setState({ finishInitFirebaseAuth: true });
      } else {
        this.setState({ finishInitFirebaseAuth: true });
      }
    });
  }

  render() {
    const routes = (this.state.finishInitFbData && this.state.finishInitFirebaseAuth) ? <Routes /> : null;
    return (
      <Provider store={Store}>
        <View style={{ flex: 1 }}>
          {routes}
        </View>
      </Provider>
    );
  }
}

export default Root;
