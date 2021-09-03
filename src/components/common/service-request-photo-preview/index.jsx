import React from 'react';
import { Button, Modal, Portal } from 'react-native-paper';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, View } from 'react-native';

import { Colors } from '../../../theme/Variables';
import { useTheme } from '../../../theme';
import CustomCarousel from '../../molecules/custom-carousel';

const { width, height } = Dimensions.get('window');
const ServiceRequestPhotoPreview = ({
  sources,
  isVisible,
  onDismiss,
  openActionSheet,
  updateFormData,
  cancelSelection,
}) => {
  const { Fonts, Common, Layout } = useTheme();

  return (
    <>
      <Portal>
        <Modal
          visible={isVisible}
          onDismiss={onDismiss}
          contentContainerStyle={styles.containerStyle}
        >
          <CustomCarousel sources={sources} />
          <View style={[Layout.rowBetween]}>
            <Button
              mode="outlined"
              icon="check"
              color={Colors.white}
              style={[styles.button]}
              labelStyle={[Fonts.textRegular, Common.whiteText]}
              onPress={() => {
                updateFormData();
                onDismiss();
              }}
            >
              Use Image{sources.length > 1 ? 's' : ''}
            </Button>
            <Button
              mode="outlined"
              icon="trash-can"
              color={Colors.white}
              style={[styles.button]}
              labelStyle={[Fonts.textRegular, Common.whiteText]}
              onPress={() => {
                cancelSelection();
                openActionSheet();
                onDismiss();
              }}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

ServiceRequestPhotoPreview.propTypes = {
  sources: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  openActionSheet: PropTypes.func.isRequired,
  updateFormData: PropTypes.func.isRequired,
  cancelSelection: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    marginTop: 10,
    width: '45%',
  },
  containerStyle: {
    backgroundColor: Colors.white,
    marginTop: '20%',
    padding: 10,
  },
  image: {
    height: height * 0.55,
    width: width * 0.95,
  },
  paginationDots: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    height: 10,
    marginHorizontal: 8,
    width: 10,
  },
});
export default ServiceRequestPhotoPreview;
