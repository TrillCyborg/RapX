import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

import { IconTextInput, ProfilePicInput } from './Input';
import ScreenContainer from './ScreenContainer';
import FacebookLogoutButton from './FacebookLogoutButton';
import {
  setUsername,
  setProfilePicUrl,
  setName,
  setTempUsername,
  setTempName,
  setTempProfilePicUrl,
  resetTempUser,
} from '../actions';
import { userIcons } from '../styles/icons.json';
import { updateUser } from '../lib/users';
import { setProfilePic } from '../lib/storage';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { mime: '', changedImage: false };
    this.selectProfilePic = this.selectProfilePic.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentWillMount() {
    this.props.setTempUsername(this.props.user.username);
    this.props.setTempName(this.props.user.name);
    this.props.setTempProfilePicUrl(this.props.user.picUrl);
  }

  componentWillUnmount() {
    this.props.resetTempUser();
  }

  selectProfilePic({ path, mime }) {
    this.setState({ mime });
    this.props.setTempProfilePicUrl(path);
    this.setState({ changedImage: true });
  }

  saveChanges() {
    let promise;
    if (this.props.temp.picUrl !== this.props.user.picUrl) {
      promise = setProfilePic({ path: this.props.temp.picUrl, type: this.state.mime })
        .then((picUrl) => {
          if (picUrl) {
            this.setState({ changedImage: false });
          }
          return updateUser(this.props.user.uid, {
            picUrl,
            username: this.props.temp.username,
            name: this.props.temp.name,
          });
        });
    } else {
      promise = updateUser(this.props.user.uid, {
        username: this.props.temp.username,
        name: this.props.temp.name,
      });
    }
    promise.then(() => {
      this.props.setUsername(this.props.temp.username);
      this.props.setName(this.props.temp.name);
      this.props.setProfilePicUrl(this.props.temp.picUrl);
    })
    .catch((error) => {
      console.log('ERROR', error);
    });
  }

  render() {
    const noChanges = (this.props.user.name === this.props.temp.name)
      && (this.props.user.username === this.props.temp.username)
      && !this.state.changedImage;
    const { nameIcon, usernameIcon } = userIcons;
    return (
      <ScreenContainer center>
        <ProfilePicInput
          picUrl={this.props.temp.picUrl}
          onPressSet={this.selectProfilePic}
        />
        <IconTextInput
          onChangeText={name => this.props.setTempName(name)}
          value={this.props.temp.name}
          iconName={nameIcon}
          placeholder="Name"
        />
        <IconTextInput
          onChangeText={username => this.props.setTempUsername(username)}
          value={this.props.temp.username}
          iconName={usernameIcon}
          placeholder="Username"
        />
        <Button
          title="Save Changes"
          buttonStyle={styles.margin}
          disabled={noChanges}
          onPress={this.saveChanges}
          backgroundColor="#397af8"
          small
          raised
        />
        <FacebookLogoutButton />
      </ScreenContainer>
    );
  }
}

Settings.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    picUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
  }),
  temp: PropTypes.shape({
    username: PropTypes.string.isRequired,
    picUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  setUsername: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  setProfilePicUrl: PropTypes.func.isRequired,
  setTempUsername: PropTypes.func.isRequired,
  setTempName: PropTypes.func.isRequired,
  setTempProfilePicUrl: PropTypes.func.isRequired,
  resetTempUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  temp: state.temp.user,
});

const styles = {
  margin: {
    marginTop: 10,
    marginBottom: 10,
  },
};

export default connect(mapStateToProps, {
  setUsername,
  setName,
  setProfilePicUrl,
  setTempUsername,
  setTempName,
  setTempProfilePicUrl,
  resetTempUser,
})(Settings);
