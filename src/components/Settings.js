import React from 'react';
import { View, Text } from 'react-native';

const Settings = () => (
  <View style={styles.container}>
    <Text>Settings</Text>
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

export default Settings;
