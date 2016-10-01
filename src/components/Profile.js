import React from 'react';
import { View, Text } from 'react-native';

const Profile = () => (
  <View style={styles.container}>
    <Text>Profile</Text>
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

export default Profile;
