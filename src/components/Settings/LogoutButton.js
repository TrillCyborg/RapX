import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { LoginManager } from 'react-native-fbsdk';
import { Button } from '../Input';
import { signOut } from '../../lib/auth';
import { toggleLoggedIn } from '../../actions';

class LogoutButton extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    const promise = new Promise((resolve) => {
      resolve(LoginManager.logOut());
    });

    promise.then(() => {
      this.props.toggleLoggedIn();
      // TODO reset all state
      signOut().then(() => Actions.welcome({ type: 'reset' }));
    });
  }

  render() {
    return <Button onPress={this.logout}>Logout</Button>;
  }
}

LogoutButton.propTypes = {
  toggleLoggedIn: PropTypes.func.isRequired,
};

export default connect(null, { toggleLoggedIn })(LogoutButton);
