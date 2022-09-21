import React, { useCallback } from 'react';
import { ScrollView, ImageBackground } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import useTheme from '../../../theme/hooks/useTheme';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header/index';
import SubscribedToChannelsDetails from '../../../components/common/subscribed-channels-details/index';
import { setTabBarVisibilityAction } from '../../../reducers/navigation-reducer/navigation.actions';

const ViewSubscribedToChannelDetailsScreen = () => {
  const { params } = useRoute();
  const dispatch = useDispatch();
  const { Images, Layout } = useTheme();

  useFocusEffect(
    useCallback(() => {
      dispatch(setTabBarVisibilityAction(true));
    }, []),
  );

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
