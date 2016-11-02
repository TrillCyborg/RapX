import React, { PropTypes } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ProfileInfo = ({ num, text, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.viewStyle}>
      <Text style={styles.numStyle}>{num}</Text>
      <Text style={styles.textStyle}>{text}</Text>
    </View>
  </TouchableOpacity>
);

ProfileInfo.propTypes = {
  num: PropTypes.number,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = {
  viewStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 5,
    alignItems: 'center',
  },
  numStyle: {
    fontSize: 16,
  },
  textStyle: {
    fontSize: 12,
  },
};

export default ProfileInfo;
