import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { LoginManager } from 'react-native-fbsdk';
import { Button } from '../Input';
import { signIn } from '../../lib/auth';

class FacebookLoginButton extends Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  login() {
    LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']).then((result) => {
      if (result.isCancelled) {
        console.log('Login was cancelled');
      } else {
        console.log('Login was successful with permissions:', result);
        signIn(() => {
          if (this.props.isRegistered) {
            Actions.main({ type: 'reset' });
          } else {
            Actions.register();
          }
        });
      }
    }
    ).catch((error) => {
      console.log('Login Error:', error);
    });
  }

  render() {
    return <Button onPress={this.login}>Login with Facebook</Button>;
  }
}

FacebookLoginButton.propTypes = {
  isRegistered: PropTypes.bool,
};

const mapStateToProps = state => ({
  isRegistered: state.app.registered,
});

export default connect(mapStateToProps)(FacebookLoginButton);
