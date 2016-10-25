import React from 'react';
import { Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScreenContainer from './ScreenContainer';

const Modal = () => (
  <ScreenContainer center>
    <Text onPress={() => Actions.pop()}>Modal</Text>
  </ScreenContainer>
);

export default Modal;
