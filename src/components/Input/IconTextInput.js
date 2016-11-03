import React, { PropTypes } from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const IconTextInput = ({ onChangeText, value, iconName, placeholder }) => {
  const { containerStyle, inputStyle, iconStyle } = styles;
  return (
    <View style={containerStyle}>
      <Icon
        name={iconName}
        size={30}
        style={iconStyle}
        color="#aaa"
      />
      <TextInput
        style={inputStyle}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
      />
    </View>
  );
};

IconTextInput.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

const styles = {
  containerStyle: {
    // flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    // height: 40,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    borderRadius: 5,
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
  },
  inputStyle: {
    flex: 8,
    height: 40,
  },
  iconStyle: {
    flex: 1,
    marginLeft: 7,
    marginTop: 4,
  },
};

export default IconTextInput;
