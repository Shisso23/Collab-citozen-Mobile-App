import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../../../theme/hooks/useTheme';
import { accountsSelector } from '../../../../reducers/accounts-reducer/accounts.reducer';
import { CreateServiceRequestForm } from '../../../../components/forms';
import {
  createServiceRequestAction,
  getServiceRequestsAction,
} from '../../../../reducers/service-request-reducer/service-request.actions';
import { flashService } from '../../../../services';
import { createServiceRequestModel } from '../../../../models';
import { municipalitiesSelector } from '../../../../reducers/municipalities-reducer/municipalities.reducer';
import HeaderBackGround from '../../../../components/atoms/header-background/index';

const CreateServiceRequestScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { accounts } = useSelector(accountsSelector);
  const { municipalities } = useSelector(municipalitiesSelector);

  const { Gutters, Common } = useTheme();

  const _onFormSuccess = async () => {
    flashService.success('Successfully created request');
    await dispatch(getServiceRequestsAction());
    navigation.popToTop();
  };

  const _handleFormSubmit = (form) => {
    return dispatch(createServiceRequestAction(form));
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={[Common.defaultBackGround]}
      extraHeight={150}
      enableOnAndroid
    >
      <HeaderBackGround backButton />
      <CreateServiceRequestForm
        submitForm={_handleFormSubmit}
        onSuccess={_onFormSuccess}
        municipalities={municipalities}
        initialValues={createServiceRequestModel({
          account: accounts[0],
        })}
        containerStyle={[Gutters.regularHMargin, Gutters.regularTMargin]}
      />
    </KeyboardAwareScrollView>
  );
};

CreateServiceRequestScreen.propTypes = {};

CreateServiceRequestScreen.defaultProps = {};

export default CreateServiceRequestScreen;
