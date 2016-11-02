import React, { Component, PropTypes } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import ProfileInfo from './ProfileInfo';
import {
  setFollowsTitle,
} from '../actions';

class ProfileTop extends Component {
  constructor(props) {
    super(props);
    this.handleFollowsPress = this.handleFollowsPress.bind(this);
  }

  handleFollowsPress(title) {
    this.props.setFollowsTitle(title);
    Actions.follows();
  }

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
              <ProfileInfo num={this.props.followersAmount} text="followers" onPress={() => this.handleFollowsPress('Followers')} />
              <ProfileInfo num={this.props.followingAmount} text="following" onPress={() => this.handleFollowsPress('Following')} />
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
  setFollowsTitle: PropTypes.func.isRequired,
};

// const mapStateToProps = state => ({
//   user: state.user,
//   temp: state.temp.user,
// });

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

export default connect(null, { setFollowsTitle })(ProfileTop);
