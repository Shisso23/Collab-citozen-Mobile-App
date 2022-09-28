import React, { useEffect } from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import OnBackPressHeader from '../../../../components/atoms/on-back-press-header/index';
import { useTheme } from '../../../../theme';
import CreateNotificationForm from '../../../../components/forms/create-notification-form/create-notification.form';
import { flashService, notificationService } from '../../../../services';
import { CreateNotificationModel } from '../../../../models/app/create-notification/create-natification.model';
import FormScreenContainer from '../../../../components/containers/form-screen-container/form-screen.container';

const CreateNotificationScreen = () => {
  const { Images, Layout, Gutters } = useTheme();
  const route = useRoute();
  const { _interestTypes, channelRef } = route.params;
  const navigation = useNavigation();
  const onNotificationCreateSuccess = () => {
    flashService.success('Success', 'Successfully created notification!');
    navigation.navigate('HomeScreen');
  };

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  const onFormSubmit = async (values) => {
    return notificationService.createNotification(values, channelRef);
  };

  return (
    <ImageBackground source={Images.serviceRequest} style={Layout.fullSize} resizeMode="cover">
      <OnBackPressHeader arrowColor="#000000" />
      <FormScreenContainer
        contentContainerStyle={[Gutters.largeBMargin, ...[{ paddingBottom: 200 }]]}
      >
        <CreateNotificationForm
          submitForm={onFormSubmit}
          onSuccess={onNotificationCreateSuccess}
          initialValues={CreateNotificationModel()}
          containerStyle={Gutters.largeHMargin}
          interestTypes={_interestTypes}
        />
      </FormScreenContainer>
    </ImageBackground>
  );
};

export default CreateNotificationScreen;
