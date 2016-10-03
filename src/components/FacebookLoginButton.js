import React, { PropTypes } from 'react';
import { LoginButton } from 'react-native-fbsdk';

const FacebookLoginButton = ({ onLoginFinished, onLogoutFinished }) => (
  <LoginButton
    readPermissions={['public_profile', 'email', 'user_friends']}
    onLoginFinished={onLoginFinished}
    onLogoutFinished={onLogoutFinished}
  />
);

FacebookLoginButton.propTypes = {
  onLoginFinished: PropTypes.func.isRequired,
  onLogoutFinished: PropTypes.func.isRequired,
};

export default FacebookLoginButton;
