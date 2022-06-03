import React from 'react';
import { ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import OnBackPressHeader from '../../../../components/atoms/on-back-press-header/index';
import { useTheme } from '../../../../theme';
import CreateNotificationForm from '../../../../components/forms/create-notification-form/create-notification.form';
import { flashService, notificationService } from '../../../../services';
import { CreateNotificationModel } from '../../../../models/app/create-notification/create-natification.model';
import FormScreenContainer from '../../../../components/containers/form-screen-container/form-screen.container';

const CreateNotificationScreen = () => {
  const { Images, Layout, Gutters } = useTheme();
  const route = useRoute();
  const { user } = useSelector((reducers) => reducers.userReducer);
  const { _interestTypes } = route.params;
  const onNotificationCreateSuccess = () => {
    flashService.success('Success', 'Successfully created notification!');
  };

  const onFormSubmit = async (values) => {
    return notificationService.createNotification(values, user.user_id);
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
