import React, { PropTypes } from 'react';
import { View } from 'react-native';

const ScreenContainer = ({ children, center }) => (
  <View style={[styles.container, center ? styles.center : null]}>
    {children}
  </View>
);

ScreenContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  center: PropTypes.bool,
};

const styles = {
  container: {
    flex: 1,
    marginTop: 65,
  },
  center: {
    justifyContent: 'flex-start', // vertical
    alignItems: 'center', // horizontal
  },
};

export default ScreenContainer;
