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
    marginTop: 70,
    backgroundColor: '#F5FCFF',
  },
  containerCenter: {
    flex: 1,
    marginTop: 70,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default ScreenContainer;
