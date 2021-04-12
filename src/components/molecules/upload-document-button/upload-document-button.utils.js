import * as ImagePicker from 'react-native-image-picker';
import * as DocumentPicker from 'react-native-document-picker';

const successfullySelectedImage = (res) => !res.didCancel;
const errorOccured = (res) => res.errorCode;

const constructFormData = (res) => ({
  uri: res.uri,
  type: res.type,
});

const imageOptions = {
  mediaType: 'photo',
  quality: 0.5,
  maxWidth: 400,
  maxHeight: 400,
};

const genericLaunch = (launchFunction) => {
  return new Promise((resolve, reject) => {
    launchFunction(imageOptions, (res) => {
      if (successfullySelectedImage(res)) {
        resolve(constructFormData(res));
      } else if (errorOccured(res)) {
        reject();
      }
    });
  });
};

export const openUserGallery = () => {
  return genericLaunch(ImagePicker.launchImageLibrary);
};

export const openUserCamera = () => {
  return genericLaunch(ImagePicker.launchCamera);
};

export const openDocumentPicker = () => {
  return DocumentPicker.pick({
    type: [DocumentPicker.types.pdf],
  }).then(constructFormData);
};
