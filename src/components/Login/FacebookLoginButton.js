import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from '../Input';
import Spinner from '../Spinner';
import { login } from '../../actions';

const FacebookLoginButton = props => (
  !props.loginLoading ? (
    <Button onPress={props.login}>Login with Facebook</Button>
  ) : (
    <Spinner />
  )
);

FacebookLoginButton.propTypes = {
  loginLoading: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loginLoading: state.app.loginLoading,
});

export default connect(mapStateToProps, { login })(FacebookLoginButton);
