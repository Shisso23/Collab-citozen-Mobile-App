import React from 'react';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text, ImageBackground } from 'react-native';

import useTheme from '../../../../theme/hooks/useTheme';
import { SubscribeToChannelsForm } from '../../../../components/forms';
import { createServiceRequestModel } from '../../../../models';
import { municipalitiesSelector } from '../../../../reducers/municipalities-reducer/municipalities.reducer';
import HeaderBackGround from '../../../../components/atoms/header-background/index';

const SubscribeToChannelsScreen = () => {
  const { municipalities } = useSelector(municipalitiesSelector);
  const { Gutters, Fonts, Images, Layout } = useTheme();

  const _onFormSuccess = async () => {};

  const _handleFormSubmit = () => {};

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
