import React, { createRef, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard } from 'react-native';
import { Text } from 'react-native-elements';
import ActionSheet from 'react-native-actions-sheet';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { openUserGallery, openUserCamera } from './upload-document-button.utils';
import UploadDocumentSelectionItem from './upload-document-selection-item';
import useTheme from '../../../theme/hooks/useTheme';
import ServiceRequestPhotoPreview from '../../common/service-request-photo-preview';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';

const actionSheetRef = createRef();
const UploadDocumentButton = ({ onImageSelect, errorMessage, title, style, disabled }) => {
  const { Common } = useTheme();
  const [documentSelected, setDocumentSelected] = useState(false);
  const [isPhotoVisible, setPhotoVisible] = useState(false);
  const [imagesSources, setImagesSources] = useState([]);
  const [newSelectedImages, setNewSelectedImages] = useState([]);
  const { isLoadingServiceRequests } = useSelector(serviceRequestSelector);

  const openActionSheet = () => {
    Keyboard.dismiss();
    return actionSheetRef.current.setModalVisible(true);
  };
  const closeActionSheet = () => actionSheetRef.current.setModalVisible(false);

  const _updateFormData = (selectedImages, docSelected = true) => {
    onImageSelect(selectedImages);
    setDocumentSelected(docSelected);
    closeActionSheet();
  };

  const removeDuplicates = (arrayOfObjectsImages) => {
    return arrayOfObjectsImages
      .map((image) => image)
      .filter((value, index, self) => self.indexOf(value) === index);
  };

  const _handlePhotoLibrary = () => {
    openUserGallery().then((selectedImages) => {
      setNewSelectedImages(selectedImages);
      const uniqueImages = removeDuplicates([...imagesSources, ...selectedImages]);
      setImagesSources(uniqueImages);
      setPhotoVisible(true);
      closeActionSheet();
    });
  };

  const _handleCamera = () => {
    openUserCamera().then(_updateFormData);
  };
  const insets = useSafeAreaInsets();
  const safeArea = {
    marginBottom: insets.bottom,
  };

  return (
    <>
      <Button
        title={title}
        mode="contained"
        onPress={openActionSheet}
        style={style}
        loading={isLoadingServiceRequests}
        icon={!documentSelected ? 'camera' : 'check'}
        disabled={disabled}
      >
        {title}
      </Button>
      <Text style={[Common.errorStyle]}>{errorMessage}</Text>
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
          setImagesSources([]);
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
};

UploadDocumentButton.defaultProps = {
  errorMessage: '',
  style: {},
  disabled: false,
};

export default UploadDocumentButton;
