import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';

const ProfileInfo = ({ num, text }) => (
  <View style={styles.viewStyle}>
    <Text style={styles.numStyle}>{num}</Text>
    <Text style={styles.textStyle}>{text}</Text>
  </View>
);

ProfileInfo.propTypes = {
  num: PropTypes.number,
  text: PropTypes.string,
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
