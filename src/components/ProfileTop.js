import React, { PropTypes } from 'react';
import { Image, View } from 'react-native';
import { Button } from 'react-native-elements';
import ProfileInfo from './ProfileInfo';

const ProfileTop = ({ image, postAmount, followersAmount, followingAmount }) => (
  <View style={{ marginTop: 10 }}>
    <View style={styles.viewStyle}>
      <Image
        style={styles.profilePicStyle}
        source={{ uri: image }}
      />
      <View style={{ alignItems: 'center' }}>
        <View style={styles.viewStyle}>
          <ProfileInfo num={postAmount} text="posts" />
          <ProfileInfo num={followersAmount} text="followers" />
          <ProfileInfo num={followingAmount} text="following" />
        </View>
        <Button
          title="Edit Profile"
          buttonStyle={styles.buttonStyle}
          onPress={this.saveChanges}
          color="#000"
          small
        />
      </View>
    </View>
  </View>
);

ProfileTop.propTypes = {
  image: PropTypes.string,
  postAmount: PropTypes.number,
  followersAmount: PropTypes.number,
  followingAmount: PropTypes.number,
};

const styles = {
  viewStyle: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  profilePicStyle: {
    marginRight: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  buttonStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 70,
    paddingRight: 70,
    backgroundColor: '#ededed',
    borderRadius: 2,
  },
};

export default ProfileTop;
