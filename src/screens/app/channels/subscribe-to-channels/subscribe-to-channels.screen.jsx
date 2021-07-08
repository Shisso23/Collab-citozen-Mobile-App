import React from 'react';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text, ImageBackground } from 'react-native';

import useTheme from '../../../../theme/hooks/useTheme';
import { SubscribeToChannelsForm } from '../../../../components/forms';
import { unsubscribedChannelsSelector } from '../../../../reducers/unsubscribed-channels/unsubscribed-channels.reducer';
import HeaderBackGround from '../../../../components/atoms/header-background/index';

const SubscribeToChannelsScreen = () => {
  const { unsubscribedChannels } = useSelector(unsubscribedChannelsSelector);
  const { Gutters, Fonts, Images, Layout } = useTheme();

  return (
    <ImageBackground source={Images.serviceRequest} style={[Layout.fullSize]} resizeMode="cover">
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid>
        <HeaderBackGround backButton />
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Subscribe To Channels</Text>
        <SubscribeToChannelsForm
          unsubscribedChannels={unsubscribedChannels}
          containerStyle={[Gutters.regularHMargin, Gutters.regularTMargin]}
        />
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

SubscribeToChannelsScreen.propTypes = {};

SubscribeToChannelsScreen.defaultProps = {};

export default SubscribeToChannelsScreen;
