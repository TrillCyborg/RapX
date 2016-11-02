import React from 'react';
import ScreenContainer from './ScreenContainer';
import ProfileTop from './ProfileTop';

const defaultProfilePicUrl = 'https://facebook.github.io/react/img/logo_og.png'; // TODO get a default pic

const Profile = () => (
  <ScreenContainer center>
    <ProfileTop
      image={defaultProfilePicUrl}
      postAmount={12}
      followersAmount={100}
      followingAmount={456}
    />
  </ScreenContainer>
);

export default Profile;
