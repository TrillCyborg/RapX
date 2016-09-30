import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { AccessToken } from 'react-native-fbsdk';
import firebase from 'firebase';
import Store from './store/Store';
import FacebookLoginButton from './components/FacebookLoginButton';
import { setFbAccessToken, toggleLoggedIn } from './actions/User';


class Root extends Component {
  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyBwTvt6DpDCcqlPaAN3ETqxpsFFhL8MlHk',
      authDomain: 'rapx-4dfa8.firebaseapp.com',
      databaseURL: 'https://rapx-4dfa8.firebaseio.com',
      storageBucket: 'rapx-4dfa8.appspot.com',
      messagingSenderId: '683961390118',
    });
    AccessToken.getCurrentAccessToken()
      .then((data) => {
        if (data) {
          Store.dispatch(setFbAccessToken(data.accessToken.toString()));
          Store.dispatch(toggleLoggedIn());
        }
      }
    );
  }

  render() {
    const { container, welcome, instructions } = styles;
    return (
      <Provider store={Store}>
        <View style={container}>
          <Text style={welcome}>
            Welcome to React Native!
          </Text>
          <Text style={instructions}>
            To get started, edit index.ios.js
          </Text>
          <Text style={instructions}>
            Press Cmd+R to reload,{'\n'}
            Cmd+D or shake for dev menu
          </Text>
          <FacebookLoginButton />
        </View>
      </Provider>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
};

export default Root;
