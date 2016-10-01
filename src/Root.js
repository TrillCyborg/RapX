import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { AccessToken } from 'react-native-fbsdk';
import firebase from 'firebase';
import Store from './store/Store';
import { setFbAccessToken, toggleLoggedIn } from './actions/User';
import Routes from './Routes';


class Root extends Component {
  constructor() {
    super();
    this.state = { gotLoginData: false };
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
      .then((data) => {
        if (data) {
          Store.dispatch(setFbAccessToken(data.accessToken.toString()));
          Store.dispatch(toggleLoggedIn());
        }
        this.setState({ gotLoginData: true });
      }
    );
  }

  render() {
    if (this.state.gotLoginData) {
      return (
        <Provider store={Store}>
          <Routes loggedIn={Store.getState().user.loggedIn} />
        </Provider>
      );
    }
    // TODO show loading screen
    return null;
  }
}

export default Root;
