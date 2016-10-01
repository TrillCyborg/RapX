import React from 'react';
import { View, Text } from 'react-native';
import FacebookLoginButton from './FacebookLoginButton';

const Feed = () => {
  const { container, welcome, instructions } = styles;
  return (
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
  );
};

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

export default Feed;
