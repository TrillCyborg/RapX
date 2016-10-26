import React, { PropTypes } from 'react';
import { Image, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { trackIcons } from '../styles/icons.json';


const Track = ({ title, image }) => (
  <View style={styles.mainViewStyle}>
    <View style={styles.rowViewStyle}>
      <Image
        style={styles.songStyle}
        source={{ uri: image }}
      />
      <Text style={{ fontSize: 20, paddingLeft: 20, paddingRight: 20 }}>{ title }</Text>
    </View>
    <View style={styles.rowViewStyle}>
      <Icon
        name={trackIcons.fire}
        size={25}
        style={styles.iconStyle}
        color="#aaa"
      />
      <Icon
        name={trackIcons.comment}
        size={25}
        style={styles.iconStyle}
        color="#aaa"
      />
      <Icon
        name={trackIcons.more}
        size={25}
        style={styles.iconStyle}
        color="#aaa"
      />
    </View>
  </View>
);

Track.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
};

const styles = {
  mainViewStyle: {
    padding: 10,
  },
  rowViewStyle: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  songStyle: {
    width: 150,
    height: 150,
    borderRadius: 2,
  },
  iconStyle: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 20,
  },
};

export default Track;
