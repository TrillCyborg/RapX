import React, { PropTypes } from 'react';
import { View, Text, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Button } from './';

const defaultProfilePicUrl = 'https://facebook.github.io/react/img/logo_og.png'; // TODO get a default pic

const ProfilePicInput = ({ picUrl, onPressSet }) => {
  const openImagePicker = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(onPressSet);
  };

  return (
    <View>
      <Text>Profile Pic</Text>
      <Image
        style={styles.profilePicStyle}
        source={{ uri: picUrl || defaultProfilePicUrl }}
      />
      <Button onPress={openImagePicker} style={styles.buttonStyle}>
        Change Image
      </Button>
    </View>
  );
};

ProfilePicInput.propTypes = {
  picUrl: PropTypes.string,
  onPressSet: PropTypes.func.isRequired,
};

const styles = {
  profilePicStyle: {
    width: 100,
    height: 100,
  },
  buttonStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
};

export default ProfilePicInput;
