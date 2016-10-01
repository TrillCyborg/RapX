import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

const Register = () => (
  <View style={styles.container}>
    <Text onPress={() => Actions.main()}>Register</Text>
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

export default Register;
