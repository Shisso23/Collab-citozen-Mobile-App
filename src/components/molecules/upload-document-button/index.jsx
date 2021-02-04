import React, { createRef, useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import ActionSheet from 'react-native-actions-sheet';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openUserGallery, openUserCamera } from './upload-document-button.utils';
import UploadDocumentSelectionItem from './upload-document-selection-item';
import useTheme from '../../../theme/hooks/useTheme';

const actionSheetRef = createRef();

const UploadDocumentButton = ({ onImageSelect, errorMessage, title, style, disabled }) => {
  const { Common } = useTheme();
  const [documentSelected, setDocumentSelected] = useState(false);

  const openActionSheet = () => actionSheetRef.current.setModalVisible(true);
  const closeActionSheet = () => actionSheetRef.current.setModalVisible(false);

  const _updateFormData = (selectedImage) => {
    onImageSelect(selectedImage);
    setDocumentSelected(true);
    closeActionSheet();
  };

  const _handlePhotoLibrary = () => {
    openUserGallery().then(_updateFormData);
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
