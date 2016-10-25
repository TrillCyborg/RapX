import React from 'react';
import { Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScreenContainer from './ScreenContainer';

const Live = () => (
  <ScreenContainer center>
    <Text onPress={() => Actions.modal()}>Live</Text>
  </ScreenContainer>
);

export default Live;
