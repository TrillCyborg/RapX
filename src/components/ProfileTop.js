import React, { Component, PropTypes } from 'react';
import { Image, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import ProfileInfo from './ProfileInfo';

class ProfileTop extends Component {
  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={styles.viewStyle}>
          <Image
            style={styles.profilePicStyle}
            source={{ uri: this.props.image }}
          />
          <View style={{ alignItems: 'center' }}>
            <View style={styles.viewStyle}>
              <ProfileInfo num={this.props.postAmount} text="posts" onPress={() => console.log('posts')} />
              <ProfileInfo num={this.props.followersAmount} text="followers" onPress={() => Actions.followers()} />
              <ProfileInfo num={this.props.followingAmount} text="following" onPress={() => Actions.following()} />
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
  }
}

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
