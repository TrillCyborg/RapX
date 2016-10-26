import React from 'react';
import { View } from 'react-native';
import ScreenContainer from './ScreenContainer';
import Track from './Track';
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
    <View style={{ paddingTop: 30 }}>
      <Track
        title="Mouse Vs. $upa"
        image={defaultProfilePicUrl}
      />
      <Track
        title="Mouse Vs. 32T"
        image={defaultProfilePicUrl}
      />
    </View>

  </ScreenContainer>
);

export default Profile;
