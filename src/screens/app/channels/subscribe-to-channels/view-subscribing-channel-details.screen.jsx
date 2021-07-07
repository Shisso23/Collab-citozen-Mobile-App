import React from 'react';
import { ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';

import useTheme from '../../../../theme/hooks/useTheme';
import OnBackPressHeader from '../../../../components/atoms/on-back-press-header/index';
import SubscribingToChannelsDetails from '../../../../components/common/subscribing-to-channels-details/index';

const ViewSubscribingChannelsDetailsScreen = () => {
  const { params } = useRoute();
  const { Images, Layout } = useTheme();

  return (
    <ImageBackground source={Images.serviceRequest} style={Layout.fullSize} resizeMode="cover">
      <OnBackPressHeader arrowColor="#000000" />
      <SubscribingToChannelsDetails channel={params} />
    </ImageBackground>
  );
};

ViewSubscribingChannelsDetailsScreen.propTypes = {};

ViewSubscribingChannelsDetailsScreen.defaultProps = {};

export default ViewSubscribingChannelsDetailsScreen;
