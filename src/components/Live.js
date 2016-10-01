import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

const Live = () => (
  <View style={styles.container}>
    <Text onPress={() => Actions.modal()}>Live</Text>
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

export default Live;
