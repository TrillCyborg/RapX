import React from 'react';
import { View, Text } from 'react-native';

const Activity = () => (
  <View style={styles.container}>
    <Text>Activity</Text>
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

export default Activity;
