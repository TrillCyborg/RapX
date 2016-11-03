import React from 'react';
import { Text } from 'react-native';
import ScreenContainer from '../ScreenContainer';

const Feed = () => {
  const { welcome, instructions } = styles;
  return (
    <ScreenContainer center>
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
    </ScreenContainer>
  );
};

const styles = {
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
