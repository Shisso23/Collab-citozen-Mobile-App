import React from 'react';
import { Button, Modal, Portal } from 'react-native-paper';
import { Image } from 'react-native-elements';
import PropTypes from 'prop-types';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { Colors } from '../../../theme/Variables';
import { useTheme } from '../../../theme';

const { width, height } = Dimensions.get('window');
const ServiceRequestPhotoPreview = ({
  source,
  isVisible,
  onDismiss,
  openActionSheet,
  updateFormData,
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
          <Image
            source={{ uri: source }}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
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
              Use Image
            </Button>
            <Button
              mode="outlined"
              icon="trash-can"
              color={Colors.white}
              style={[styles.button]}
              labelStyle={[Fonts.textRegular, Common.whiteText]}
              onPress={() => {
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
  source: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  openActionSheet: PropTypes.func.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    marginTop: 10,
    width: '45%',
  },
  containerStyle: {
    backgroundColor: Colors.white,
    padding: 10,
  },
  image: {
    height: height * 0.6,
    width,
  },
});
export default ServiceRequestPhotoPreview;
