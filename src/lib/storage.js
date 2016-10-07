import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'firebase';
import Store from '../store/Store';
import { setProfilePicUrl } from '../actions';

const fs = RNFetchBlob.fs;
const dirs = RNFetchBlob.fs.dirs;
const Blob = RNFetchBlob.polyfill.Blob;
const getExt = (path) => {
  let e = path.split('.');
  e = e[e.length - 1].split('?');
  return e[0];
};

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;





// Returns Promise(snapshot)
const firebaseUpload = ({ path, type }, location) => {
  const file = RNFetchBlob.wrap(path);
  return Blob.build(file, { type })
    .then(data => firebase.storage()
      .ref(location)
      .put(data, { contentType: type })
    );
};

const firebaseUploadBlob = (blob, location) => firebase.storage()
  .ref(location)
  .put(blob, { contentType: blob.type });

const setProfilePic = ({ path, type }, isUrl) => {
  let upload;
  const location = `profile_pics/${firebase.auth().currentUser.uid}.${getExt(path)}`;
  if (isUrl) {
    upload = getBlobFromUrl(path).then(blob => firebaseUploadBlob(blob, location));
  } else {
    upload = firebaseUpload({ path, type }, location);
  }
  return upload.then(() => firebase.storage().ref(location).getDownloadURL())
    .then(photoURL => firebase.auth().currentUser.updateProfile({ photoURL }))
    .then(() => {
      Store.dispatch(setProfilePicUrl(firebase.auth().currentUser.photoURL));
      return new Promise((fulfill) => {
        fulfill(firebase.auth().currentUser.photoURL);
      });
    }, (error) => {
      console.log('ERROR', error);
      return new Promise((fulfill, reject) => {
        reject(error);
      });
    });
};

const getBlobFromUrl = url => RNFetchBlob.fetch('GET', url)
  .then(res => res.blob());

export {
  firebaseUpload,
  firebaseUploadBlob,
  getBlobFromUrl,
  setProfilePic,
};
