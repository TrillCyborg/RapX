import React, { PropTypes } from 'react';
import { View } from 'react-native';

const ScreenContainer = ({ children, center }) => {
  const { containerCenter, container } = styles;
  return (
    <View style={center ? containerCenter : container}>
      {children}
    </View>
  );
};

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
  containerCenter: {
    flex: 1,
    marginTop: 65,
    justifyContent: 'flex-start', // vertical
    alignItems: 'center', // horizontal
  },
};

export default ScreenContainer;
