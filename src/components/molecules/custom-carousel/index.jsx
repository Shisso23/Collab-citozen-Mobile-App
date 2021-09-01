import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, Dimensions, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { Colors } from '../../../theme/Variables';
import useTheme from '../../../theme/hooks/useTheme';

const { width, height } = Dimensions.get('window');
const CustomCarousel = ({ sources, isHttpUrl }) => {
  const [activeImage, setActiveImage] = useState(0);
  const { Layout } = useTheme();

  const renderPagination = () => {
    return (
      <Pagination
        dotsLength={_.get(sources, 'length', 0)}
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

  // eslint-disable-next-line react/prop-types
  const _renderCarouselItem = ({ item }) => {
    return (
      <ImageBackground
        source={isHttpUrl ? item : { uri: _.get(item, 'uri', null) }}
        style={[styles.image, Layout.alignItemsCenter, Layout.justifyContentCenter]}
        PlaceholderContent={<ActivityIndicator />}
      />
    );
  };

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

const styles = StyleSheet.create({
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

CustomCarousel.propTypes = {
  sources: PropTypes.array.isRequired,
  isHttpUrl: PropTypes.bool,
};

CustomCarousel.defaultProps = {
  isHttpUrl: false,
};

export default CustomCarousel;
