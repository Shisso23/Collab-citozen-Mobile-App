import React, { createRef, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard } from 'react-native';
import { Text } from 'react-native-elements';
import ActionSheet from 'react-native-actions-sheet';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { openUserGallery, openUserCamera } from './upload-document-button.utils';
import UploadDocumentSelectionItem from './upload-document-selection-item';
import useTheme from '../../../theme/hooks/useTheme';
import ServiceRequestPhotoPreview from '../../common/service-request-photo-preview';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import { setImagesSources } from '../../../reducers/service-request-reducer/service-request.actions';

const actionSheetRef = createRef();
const UploadDocumentButton = (props) => {
  const { Common } = useTheme();
  const dispatch = useDispatch();
  const [documentSelected, setDocumentSelected] = useState(false);
  const [isPhotoVisible, setPhotoVisible] = useState(false);
  const [newSelectedImages, setNewSelectedImages] = useState([]);
  const { isLoadingServiceRequests, imagesSources } = useSelector(serviceRequestSelector);

  const openActionSheet = () => {
    Keyboard.dismiss();
    return actionSheetRef.current.setModalVisible(true);
  };
  const closeActionSheet = () => actionSheetRef.current.setModalVisible(false);

  const _updateFormData = (selectedImages, docSelected = true) => {
    if (props.onImageSelect) {
      props.onImageSelect(selectedImages);
    }
    setDocumentSelected(docSelected);
    closeActionSheet();
  };

  const removeDuplicates = (images) => {
    return images.reduce((unique, image) => {
      if (!unique.some((uniqueImg) => uniqueImg.uri === image.uri)) {
        unique.push(image);
      }
      return unique;
    }, []);
  };

  const _handlePhotoLibrary = () => {
    openUserGallery().then((selectedImages) => {
      setNewSelectedImages(selectedImages);
      const uniqueImages = removeDuplicates([...imagesSources, ...selectedImages]);
      dispatch(setImagesSources(uniqueImages));
      setImagesSources(uniqueImages);
      setPhotoVisible(true);
      closeActionSheet();
    });
  };

  const canceleImages = () => {
    return imagesSources.filter((image) => {
      return !newSelectedImages.some((newImage) => {
        return newImage.uri === image.uri;
      });
    });
  };

  const _handleCamera = () => {
    openUserCamera().then((cameraPhotos) => {
      setNewSelectedImages(cameraPhotos);
      const uniqueImages = removeDuplicates([...imagesSources, ...cameraPhotos]);
      dispatch(setImagesSources(uniqueImages));
      setImagesSources(uniqueImages);
      setPhotoVisible(true);
      closeActionSheet();
    });
  };
  const insets = useSafeAreaInsets();
  const safeArea = {
    marginBottom: insets.bottom,
  };

  return (
    <>
      <Button
        title={_.get(props, 'title', '')}
        mode="contained"
        onPress={openActionSheet}
        style={_.get(props, 'style', {})}
        loading={isLoadingServiceRequests}
        icon={!documentSelected ? 'camera' : 'check'}
        disabled={_.get(props, 'disabled', false)}
        {...props}
      >
        {_.get(props, 'title', '')}
      </Button>
      <Text style={[Common.errorStyle]}>{_.get(props, 'errorMessage', '')}</Text>
      <ActionSheet ref={actionSheetRef} gestureEnabled>
        <View style={safeArea}>
          <UploadDocumentSelectionItem title="Take Photo" onPress={_handleCamera} />
          <UploadDocumentSelectionItem
            title="Choose Photo From Library"
            onPress={_handlePhotoLibrary}
          />
          <UploadDocumentSelectionItem title="Cancel" onPress={closeActionSheet} />
        </View>
      </ActionSheet>

      <ServiceRequestPhotoPreview
        sources={newSelectedImages}
        isVisible={isPhotoVisible}
        onDismiss={() => setPhotoVisible(false)}
        openActionSheet={() => openActionSheet}
        cancelSelection={() => {
          dispatch(setImagesSources(canceleImages()));
        }}
        updateFormData={() => {
          _updateFormData(imagesSources);
        }}
      />
    </>
  );
};

UploadDocumentButton.propTypes = {
  onImageSelect: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  title: PropTypes.string.isRequired,
  style: PropTypes.array,
  disabled: PropTypes.bool,
  buttonProps: PropTypes.any,
};

UploadDocumentButton.defaultProps = {
  errorMessage: '',
  style: {},
  disabled: false,
  buttonProps: {},
};

export default UploadDocumentButton;
