import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

const Modal = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    }}
  >
    <Text onPress={() => Actions.pop()}>Modal</Text>
  </View>
);

export default Modal;
