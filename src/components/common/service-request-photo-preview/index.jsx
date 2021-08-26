import React, { useState } from 'react';
import { Button, Modal, Portal } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { ActivityIndicator, Dimensions, StyleSheet, View, ImageBackground } from 'react-native';
import _ from 'lodash';
import { Colors } from '../../../theme/Variables';
import { useTheme } from '../../../theme';

const { width, height } = Dimensions.get('window');
const ServiceRequestPhotoPreview = ({
  sources,
  isVisible,
  onDismiss,
  openActionSheet,
  updateFormData,
  cancelSelection,
}) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  const { Fonts, Common, Layout } = useTheme();
  const showPreviousImage = () => {
    if (sourceIndex > 0) {
      const newIndex = sourceIndex - 1;
      setSourceIndex(newIndex);
      setSourceIndex(newIndex);
    }
  };
  const showNextImage = () => {
    if (sourceIndex < sources.length - 1) {
      const newIndex = sourceIndex + 1;
      setSourceIndex(newIndex);
      setSourceIndex(newIndex);
    }
  };
  const renderNextPrev = () => {
    return sources.length > 1 ? (
      <View style={[styles.nextPrev, Layout.rowBetween]}>
        <Icon
          name="chevron-left"
          type="font-awesome"
          size={35}
          disabled={sourceIndex === 0}
          onPress={showPreviousImage}
        />
        <Icon
          name="chevron-right"
          type="font-awesome"
          size={35}
          disabled={sourceIndex === sources.length - 1}
          onPress={showNextImage}
        />
      </View>
    ) : (
      <View />
    );
  };
  return (
    <>
      <Portal>
        <Modal
          visible={isVisible}
          onDismiss={onDismiss}
          contentContainerStyle={styles.containerStyle}
        >
          <ImageBackground
            source={{ uri: _.get(sources[sourceIndex], 'uri', null) }}
            style={[styles.image, Layout.alignItemsCenter, Layout.justifyContentCenter]}
            PlaceholderContent={<ActivityIndicator />}
          >
            {renderNextPrev()}
          </ImageBackground>
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
    padding: 10,
  },
  image: {
    height: height * 0.6,
    width,
  },
  nextPrev: { width: '90%' },
});
export default ServiceRequestPhotoPreview;
