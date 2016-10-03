import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children, disabled }) => {
  const { textStyle, buttonStyle, disabledButtonStyle, disabledTextStyle } = styles;
  if (disabled) {
    return (
      <View style={disabledButtonStyle}>
        <Text style={disabledTextStyle}>{children}</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 5,
    marginRight: 5,
  },
  disabledTextStyle: {
    alignSelf: 'center',
    color: 'gray',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
  },
  disabledButtonStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginLeft: 5,
    marginRight: 5,
  },
};

export default Button;
