/* eslint-disable */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { Text, ImageBackground } from 'react-native';

import useTheme from '../../../../theme/hooks/useTheme';
import { SubscribeToChannelsForm } from '../../../../components/forms';
import {
  createServiceRequestAction,
  getServiceRequestsAction,
} from '../../../../reducers/service-request-reducer/service-request.actions';
import { flashService } from '../../../../services';
import { createServiceRequestModel } from '../../../../models';
import { municipalitiesSelector } from '../../../../reducers/municipalities-reducer/municipalities.reducer';
import HeaderBackGround from '../../../../components/atoms/header-background/index';

const SubscribeToChannelsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { municipalities } = useSelector(municipalitiesSelector);

  const { Gutters, Common, Fonts, Images, Layout } = useTheme();

  // navigate to channels screen
  const _onFormSuccess = async () => {
    // flashService.success('Successfully created request');
    // await dispatch(getServiceRequestsAction());
    // navigation.popToTop();
  };

  // dispatch subscribe to channels
  const _handleFormSubmit = (form) => {
    // return dispatch(createServiceRequestAction(form));
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
          initialValues={createServiceRequestModel()}
          containerStyle={[Gutters.regularHMargin, Gutters.regularTMargin]}
        />
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

SubscribeToChannelsScreen.propTypes = {};

SubscribeToChannelsScreen.defaultProps = {};

export default SubscribeToChannelsScreen;
