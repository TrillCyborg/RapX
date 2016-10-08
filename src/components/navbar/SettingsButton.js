import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { navBarIcons } from '../../styles/icons.json';

const SettingsButton = () => (
  <TouchableOpacity onPress={() => Actions.settings()}>
    <Icon
      name={navBarIcons.settingsIcon}
      size={25}
      color="#000"
    />
  </TouchableOpacity>
);

export default SettingsButton;
