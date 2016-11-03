import React, { PropTypes } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

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
    <View style={styles.viewStyle}>
      <Image
        style={styles.profilePicStyle}
        source={{ uri: picUrl || defaultProfilePicUrl }}
      />

      <TouchableOpacity onPress={openImagePicker}>
        <Text style={styles.textLinkStyle}>Edit Profile Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

ProfilePicInput.propTypes = {
  picUrl: PropTypes.string,
  onPressSet: PropTypes.func.isRequired,
};

const styles = {
  profilePicStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'flex-start',
  },
  buttonStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#397af8',
    borderRadius: 2,
  },
  viewStyle: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLinkStyle: {
    color: '#397af8',
    marginTop: 5,
  },
};

export default ProfilePicInput;
