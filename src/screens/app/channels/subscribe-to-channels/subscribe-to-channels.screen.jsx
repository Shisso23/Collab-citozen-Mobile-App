import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { Text, ImageBackground } from 'react-native';

import useTheme from '../../../../theme/hooks/useTheme';
import { SubscribeToChannelsForm } from '../../../../components/forms';
import { subscribeToChannelsAction } from '../../../../reducers/subscribe-to-channels-reducer/subscribe-to-channel.actions';
import { getMyChannelsAction } from '../../../../reducers/my-channels/my-channels.actions';
import { flashService } from '../../../../services';
import { subscriptionListModel } from '../../../../models';
import { municipalitiesSelector } from '../../../../reducers/municipalities-reducer/municipalities.reducer';
import HeaderBackGround from '../../../../components/atoms/header-background/index';

const SubscribeToChannelsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { municipalities } = useSelector(municipalitiesSelector);
  const { Gutters, Fonts, Images, Layout } = useTheme();
  const { user } = useSelector((reducers) => reducers.userReducer);

  const _onFormSuccess = async () => {
    await dispatch(getMyChannelsAction());
    navigation.popToTop();
    flashService.success('Successfully Subscribed To Channels');
  };

  const _handleFormSubmit = (form) => {
    return dispatch(subscribeToChannelsAction(form.channels, user));
  };

  return (
    <ImageBackground source={Images.serviceRequest} style={[Layout.fullSize]} resizeMode="cover">
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid>
        <HeaderBackGround backButton />
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Subscribe To Channels</Text>
        <SubscribeToChannelsForm
          submitForm={_handleFormSubmit}
          onSuccess={_onFormSuccess}
          municipalities={municipalities}
          initialValues={subscriptionListModel()}
          containerStyle={[Gutters.regularHMargin, Gutters.regularTMargin]}
        />
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

SubscribeToChannelsScreen.propTypes = {};

SubscribeToChannelsScreen.defaultProps = {};

export default SubscribeToChannelsScreen;
