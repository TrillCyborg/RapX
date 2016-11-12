import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import Store from './store/Store';
import { initLogin } from './actions';
import Routes from './Routes';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      finishLogin: false,
    };
  }

  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyBwTvt6DpDCcqlPaAN3ETqxpsFFhL8MlHk',
      authDomain: 'rapx-4dfa8.firebaseapp.com',
      databaseURL: 'https://rapx-4dfa8.firebaseio.com',
      storageBucket: 'rapx-4dfa8.appspot.com',
      messagingSenderId: '683961390118',
    });
    Store.dispatch(initLogin(() => {
      this.setState({ finishLogin: true });
    }));
  }

  render() {
    const routes = this.state.finishLogin ? <Routes /> : null;
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
