import firebase from 'firebase';

const getCurrentUser = () => firebase.auth().currentUser;

const updateProfile = ({ username, email, picUrl }) => {
  const params = {};
  const updateEmail = () => {
    if (email) {
      return getCurrentUser().updateEmail(email);
    }
    return true;
  };

  if (username || picUrl) {
    if (username) params.displayName = username;
    if (picUrl) params.photoURL = picUrl;
    return getCurrentUser().updateProfile(params)
      .then(updateEmail, (error) => {
        console.log('ERROR', error);
      });
  }
  return updateEmail();
};

export {
  getCurrentUser,
  updateProfile,
};
