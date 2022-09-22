import React from 'react';
import { ScrollView, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';

import useTheme from '../../../theme/hooks/useTheme';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header/index';
import SubscribedToChannelsDetails from '../../../components/common/subscribed-channels-details/index';

const ViewSubscribedToChannelDetailsScreen = () => {
  const { params } = useRoute();
  const { Images, Layout } = useTheme();

  return (
    <ImageBackground source={Images.serviceRequest} style={Layout.fullSize} resizeMode="cover">
      <OnBackPressHeader arrowColor="#000000" />
      <ScrollView>
        <SubscribedToChannelsDetails channel={params} />
      </ScrollView>
    </ImageBackground>
  );
};

ViewSubscribedToChannelDetailsScreen.propTypes = {};

ViewSubscribedToChannelDetailsScreen.defaultProps = {};

export default ViewSubscribedToChannelDetailsScreen;
