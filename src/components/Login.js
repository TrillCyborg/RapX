import React from 'react';
import { View } from 'react-native';
import FacebookLoginButton from './FacebookLoginButton';

const Login = () => (
  <View style={styles.container}>
    <FacebookLoginButton />
  </View>
);

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
};

export default Login;
