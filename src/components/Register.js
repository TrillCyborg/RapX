import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import axios from 'axios';
import { setUsername, setProfilePicUrl, setName } from '../actions';
import { getUserOnce, registerUser } from '../database/users';
import Button from './Button';

const defaultProfilePicUrl = 'https://facebook.github.io/react/img/logo_og.png'; // TODO get a default pic

class Register extends Component {
  constructor(props) {
    super(props);
    this.getUserFbUserData = this.getUserFbUserData.bind(this);
    this.registerOnPress = this.registerOnPress.bind(this);
    this.registerData = {};
  }

  componentDidMount() {
    this.getUserFbUserData();
  }

  getUserFbUserData() {
    const { fbAccessToken, uid } = this.props.user;
    axios.get(`https://graph.facebook.com/v2.7/me?fields=id,first_name,last_name,gender,email,age_range,friends&access_token=${fbAccessToken}`)
      .then((response) => {
        axios.get(`https://graph.facebook.com/v2.7/me/picture?type=large&redirect=0&access_token=${fbAccessToken}`)
          .then((picResponse) => {
            this.props.setProfilePicUrl(picResponse.data.data.url);
            getUserOnce(uid, (snapshot) => {
              this.registerData = snapshot.val();
              this.registerData.gender = response.data.gender;
              this.registerData.age_range = `${response.data.age_range.min}-${response.data.age_range.max}`;
              this.registerData.picUrl = picResponse.data.data.url;
            });
          })
          .catch((error) => {
            console.log('ERROR', error);
          });
      })
      .catch((error) => {
        console.log('ERROR', error);
      });
  }

  registerOnPress() {
    // TODO: pic in firebase storage
    this.registerData.name = this.props.user.name;
    this.registerData.username = this.props.user.username;
    console.log('REGISTER DATA', this.registerData);
    registerUser(this.props.user.uid, this.registerData);
    Actions.main();
  }

  render() {
    const { containerStyle, inputStyle, profilePicStyle } = styles;
    return (
      <View style={containerStyle}>
        <Text>Profile Pic</Text>
        <Image
          style={profilePicStyle}
          source={{ uri: this.props.user.picUrl || defaultProfilePicUrl }}
        />
        <Button
          disabled={!(this.props.user.username.length && this.props.user.name.length)}
          onPress={this.registerOnPress}
        >
          Change Image
        </Button>
        <Text>Name</Text>
        <TextInput
          style={inputStyle}
          onChangeText={name => this.props.setName(name)}
          value={this.props.user.name}
        />
        <Text>Username</Text>
        <TextInput
          style={inputStyle}
          onChangeText={username => this.props.setUsername(username)}
          value={this.props.user.username}
        />
        <Button
          disabled={!(this.props.user.username.length && this.props.user.name.length)}
          onPress={this.registerOnPress}
        >
          Register
        </Button>
      </View>
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
  setProfilePicUrl: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
};

const styles = {
  containerStyle: {
    flex: 1,
    marginTop: 70,
    backgroundColor: '#F5FCFF',
  },
  inputStyle: {
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  profilePicStyle: {
    width: 100,
    height: 100,
  },
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  setUsername,
  setProfilePicUrl,
  setName,
  registerUser,
})(Register);
