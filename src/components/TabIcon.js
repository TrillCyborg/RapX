import React, { PropTypes } from 'react';
import { Text } from 'react-native';

const TabIcon = ({ selected, title }) => (
  <Text style={{ color: selected ? 'red' : 'black' }}>{title}</Text>
);

TabIcon.propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

export default TabIcon;
