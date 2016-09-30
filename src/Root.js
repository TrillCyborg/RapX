import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import Store from './store/Store';

const Root = () => {
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
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
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
});

export default Root;
