import ImagePicker from 'react-native-image-crop-picker';
import * as DocumentPicker from 'react-native-document-picker';
import _ from 'lodash';

const successfullySelectedImage = (res) => !res.didCancel;
const errorOccured = (res) => res.errorCode;

const constructFormData = (res = []) => {
  const response = [res].flat();
  return response.map((image) => {
    return {
      uri: image.path,
      type: image.mime,
      size: _.get(image, 'size', 0) / 1000,
    };
  });
};

const imageOptions = {
  mediaType: 'photo',
  multiple: true,
  compressImageQuality: 0.5,
  width: 400,
  height: 400,
  cropping: true,
};

const genericLaunch = (launchFunction) => {
  return new Promise((resolve, reject) => {
    launchFunction(imageOptions).then((res) => {
      if (successfullySelectedImage(res)) {
        resolve(constructFormData(res));
      } else if (errorOccured(res)) {
        reject();
      }
    });
  });
};

export const openUserGallery = () => {
  return genericLaunch(ImagePicker.openPicker);
};

export const openUserCamera = () => {
  return genericLaunch(ImagePicker.openCamera);
};

export const openDocumentPicker = () => {
  return DocumentPicker.pickMultiple({
    type: [DocumentPicker.types.pdf],
  }).then((DocumentPickerResponse) => {
    constructFormData(DocumentPickerResponse);
  });
};
