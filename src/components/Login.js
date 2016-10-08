import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { signIn } from '../lib/auth';
import FacebookLoginButton from './FacebookLoginButton';
import ScreenContainer from './ScreenContainer';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onLoginFinished = this.onLoginFinished.bind(this);
  }

  onLoginFinished(error, result) {
    if (error) {
      console.log(`Login failed with error: ${result.error}`);
    } else if (result.isCancelled) {
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

  render() {
    return (
      <ScreenContainer center>
        <FacebookLoginButton
          onLoginFinished={this.onLoginFinished}
          onLogoutFinished={() => {}}
        />
      </ScreenContainer>
    );
  }
}

Login.propTypes = {
  isRegistered: PropTypes.bool,
};

const mapStateToProps = state => ({
  isRegistered: state.app.registered,
});

export default connect(mapStateToProps)(Login);
