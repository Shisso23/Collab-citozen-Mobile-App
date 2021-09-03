import React, { useState } from 'react';
import { Button, Modal, Portal } from 'react-native-paper';
import PropTypes from 'prop-types';
import { ActivityIndicator, Dimensions, StyleSheet, View, ImageBackground } from 'react-native';
import _ from 'lodash';
import Carousel, { Pagination } from 'react-native-snap-carousel';

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
  const [activeImage, setActiveImage] = useState(0);
  const { Fonts, Common, Layout } = useTheme();

  const renderPagination = () => {
    return (
      <Pagination
        dotsLength={sources.length}
        activeDotIndex={activeImage}
        containerStyle={{ backgroundColor: Colors.transparent }}
        dotStyle={styles.paginationDots}
        inactiveDotStyle={{
          backgroundColor: Colors.darkgray,
        }}
        activeOpacity={1}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  const _renderCarouselItem = (item) => {
    return (
      <ImageBackground
        source={{ uri: _.get(item, 'uri', null) }}
        style={[styles.image, Layout.alignItemsCenter, Layout.justifyContentCenter]}
        PlaceholderContent={<ActivityIndicator />}
      />
    );
  };
  const renderCarousel = () => {
    return (
      <>
        <Carousel
          data={sources}
          renderItem={_renderCarouselItem}
          sliderWidth={width}
          itemWidth={width}
          layout="tinder"
          layoutCardOffset="9"
          onSnapToItem={(index) => setActiveImage(index)}
        />
        {renderPagination()}
      </>
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
          {renderCarousel()}
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
