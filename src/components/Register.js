import React, { Component, PropTypes } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios from 'axios';
import { setUsername, setProfilePicUrl, setName } from '../actions';
import { userIcons } from '../styles/icons.json';
import { setProfilePic } from '../lib/storage';
import { updateUser, getUserOnce, registerUser } from '../lib/users';
import { Button, IconTextInput, ProfilePicInput } from './Input';
import ScreenContainer from './ScreenContainer';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { changedImage: false };
    this.getUserFbUserData = this.getUserFbUserData.bind(this);
    this.registerOnPress = this.registerOnPress.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.setFBPic = this.setFBPic.bind(this);
    this.registerData = {};
  }

  componentDidMount() {
    this.getUserFbUserData();
  }

  getUserFbUserData() {
    const { fbAccessToken, uid } = this.props.user;
    axios.get(`https://graph.facebook.com/v2.7/me?fields=id,first_name,last_name,gender,email,age_range,friends&access_token=${fbAccessToken}`)
      .then(response => getUserOnce(uid).then(snapshot => ({ snapshot, response })))
      .then(({ snapshot, response }) => {
        this.registerData = snapshot.val();
        this.registerData.gender = response.data.gender;
        this.registerData.age_range = `${response.data.age_range.min}-${response.data.age_range.max}`;
        this.setFBPic();
      })
      .catch((error) => {
        console.log('ERROR', error);
      });
  }

  setFBPic() {
    axios.get(`https://graph.facebook.com/v2.7/me/picture?type=large&redirect=0&access_token=${this.props.user.fbAccessToken}`)
      .then(response => setProfilePic({ path: response.data.data.url }, true))
      .then(picUrl => updateUser(this.props.user.uid, { picUrl }).then(() => picUrl))
      .then(picUrl => this.props.setProfilePicUrl(picUrl));
  }

  registerOnPress() {
    this.registerData.name = this.props.user.name;
    this.registerData.username = this.props.user.username;
    this.registerData.picUrl = this.props.user.picUrl;
    console.log('REGISTER DATA', this.registerData);
    registerUser(this.props.user.uid, this.registerData);
    Actions.main();
  }

  selectImage({ path, mime }) {
    setProfilePic({ path, type: mime })
      .then((picUrl) => {
        if (picUrl) {
          this.setState({ changedImage: true });
        }
        return updateUser(this.props.user.uid, { picUrl }).then(() => picUrl);
      })
      .then(picUrl => this.props.setProfilePicUrl(picUrl))
      .catch((error) => {
        console.log('ERROR', error);
      });
  }

  render() {
    const { usernameIcon, nameIcon } = userIcons;
    return (
      <ScreenContainer>
        <ProfilePicInput
          picUrl={this.props.user.picUrl}
          onPressSet={this.selectImage}
        />
        <IconTextInput
          onChangeText={name => this.props.setName(name)}
          value={this.props.user.name}
          iconName={nameIcon}
          placeholder="Name"
        />
        <IconTextInput
          onChangeText={username => this.props.setUsername(username)}
          value={this.props.user.username}
          iconName={usernameIcon}
          placeholder="Username"
        />
        <Button
          disabled={!(this.props.user.username.length && this.props.user.name.length)}
          onPress={this.registerOnPress}
        >
          Register
        </Button>
      </ScreenContainer>
    );
  }
}

Register.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    fbAccessToken: PropTypes.string,
    picUrl: PropTypes.string,
    name: PropTypes.string,
    uid: PropTypes.string,
  }),
  setUsername: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  setProfilePicUrl: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  setUsername,
  setProfilePicUrl,
  setName,
})(Register);
