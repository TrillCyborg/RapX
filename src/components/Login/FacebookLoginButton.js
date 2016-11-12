import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Button } from '../Input';
import Spinner from '../Spinner';
import { login } from '../../actions';

class FacebookLoginButton extends Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  login() {
    this.props.login(() => {
      if (this.props.isRegistered) {
        Actions.main({ type: 'reset' });
      } else {
        Actions.register();
      }
    });
  }

  render() {
    return !this.props.loginLoading ? (
      <Button onPress={this.login}>Login with Facebook</Button>
    ) : (
      <Spinner />
    );
  }
}

FacebookLoginButton.propTypes = {
  isRegistered: PropTypes.bool,
  loginLoading: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isRegistered: state.app.registered,
  loginLoading: state.app.loginLoading,
});

export default connect(mapStateToProps, { login })(FacebookLoginButton);
