import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { ViewPropTypes, View } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  selectAccountSchema,
  selectServiceTypeCategorySchema,
  selectServiceTypeSchema,
  descriptionSchema,
  locationSchema,
} from '../form-validaton-schemas';
import { getFormError } from '../form-utils';
import useTheme from '../../../theme/hooks/useTheme';
import { DropdownSelect } from '../../atoms';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';
import {
  clearLocationAction,
  getAddressFromRegionAction,
} from '../../../reducers/location-reducer/location.actions';
import { flashService, permissionsService } from '../../../services';
import UploadDocumentButton from '../../molecules/upload-document-button';
import appConfig from '../../../config';

navigator.geolocation = require('react-native-geolocation-service');

const CreateServiceRequestForm = ({
  submitForm,
  onSuccess,
  containerStyle,
  initialValues,
  accounts,
  municipalities,
}) => {
  const { Common, Layout, Gutters } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { selectedAddress, region } = useSelector(locationSelector);
  const [address, setAddress] = useState('');
  useEffect(() => {
    return () => {
      dispatch(clearLocationAction());
    };
  }, []);

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  const validationSchema = Yup.object().shape({
    account: selectAccountSchema,
    serviceTypeCategory: selectServiceTypeCategorySchema,
    serviceType: selectServiceTypeSchema,
    description: descriptionSchema,
    location: locationSchema,
  });

  const _handleSelectLocationClick = async () => {
    try {
      await permissionsService.checkLocationPermissions();
      navigation.navigate('SelectLocationScreen');
    } catch (err) {
      flashService.error(err.message);
    }
  };

  const _handleFormSubmitError = (error, actions) => {
    actions.setSubmitting(false);
    actions.setFieldError('account', error.message);
  };

  const _handleSubmission = (formData, actions) => {
    submitForm(formData)
      .then(() => {
        actions.setSubmitting(false);
        onSuccess();
      })
      .catch((error) => _handleFormSubmitError(error, actions, formData));
  };

  return (
    <View style={containerStyle}>
      <Formik
        initialValues={initialValues}
        initialStatus={{ apiErrors: {} }}
        onSubmit={_handleSubmission}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          isSubmitting,
          handleBlur,
          touched,
          status,
          setFieldValue,
          setFieldTouched,
        }) => {
          const currentAccount = values.account;
          const currentCategory = values.serviceTypeCategory;

          const memiozedAccounts = useMemo(() => accounts, [accounts]);
          const memiozedServiceTypeCategories = useMemo(
            () => Object.keys(municipalities[currentAccount.municipalityCode].serviceTypes),
            [currentAccount],
          );
          const memiozedServiceTypes = useMemo(
            () => municipalities[currentAccount.municipalityCode].serviceTypes[currentCategory],
            [currentCategory],
          );

          useEffect(() => {
            setFieldValue('location', region);
          }, [region]);

          const error = (name) => getFormError(name, { touched, status, errors });
          return (
            <>
              <DropdownSelect
                label="Properties"
                items={memiozedAccounts}
                placeholder="Select Account"
                onBlur={() => {
                  setFieldTouched('account', true);
                }}
                keyExtractor={(item) => item.id}
                valueExtractor={(item) => item.name}
                onChange={(newAccount) => {
                  setFieldValue('serviceTypeCategory', ''); // force reset on categories
                  setFieldValue('serviceType', null); // force reset on serviceType
                  setFieldValue('account', newAccount);
                }}
                value={values.account?.name}
                error={error('account')}
                errorStyle={Common.errorStyle}
              />

              <DropdownSelect
                disabled={_.isNull(values.account)}
                items={memiozedServiceTypeCategories}
                label="Service Type Category"
                keyExtractor={(item) => item}
                valueExtractor={(item) => item}
                onBlur={() => {
                  setFieldTouched('serviceTypeCategory', true);
                }}
                placeholder="Select Service Category"
                onChange={(newServiceTypeCategory) => {
                  setFieldValue('serviceType', null);
                  setFieldValue('serviceTypeCategory', newServiceTypeCategory);
                }}
                value={values.serviceTypeCategory}
                error={error('serviceTypeCategory')}
                errorStyle={Common.errorStyle}
              />

              <DropdownSelect
                disabled={_.isNull(values.serviceTypeCategory)}
                items={memiozedServiceTypes}
                label="Service Type"
                keyExtractor={(item) => item.id}
                valueExtractor={(item) => item.name}
                onBlur={() => {
                  setFieldTouched('serviceType', true);
                }}
                placeholder="Select Service Type"
                onChange={(newServiceType) => setFieldValue('serviceType', newServiceType)}
                value={values.serviceType?.name}
                error={error('serviceType')}
                errorStyle={Common.errorStyle}
              />

              <TextInput
                label="Description"
                value={values.description}
                multiline
                onBlur={handleBlur('description')}
                onChangeText={handleChange('description')}
                style={[Common.textInput]}
                error={error('description')}
              />
              <HelperText style={Common.errorStyle} type="error" visible={error('description')}>
                {error('description')}
              </HelperText>
              <GooglePlacesAutocomplete
                placeholder="Location"
                enablePoweredByContainer={false}
                debounce={3}
                fetchDetails
                onPress={(data, details = null) => {
                  const newRegion = _.get(details, 'geometry.location');
                  dispatch(
                    getAddressFromRegionAction({
                      latitude: newRegion.lat,
                      longitude: newRegion.lng,
                    }),
                  );
                }}
                query={{
                  key: appConfig.googleMapsApiKey,
                  language: 'en',
                  components: 'country:za',
                }}
                enableHighAccuracyLocation
                minLength={3}
                styles={{
                  textInput: Common.googleAutoCompleteInput,
                }}
                textInputProps={{
                  InputComp: TextInput,
                  errorMessage: error('location'),
                  listViewDisplayed: true,
                  onChangeText: (text) => {
                    setAddress(text);
                  },
                  value: address,
                }}
              />
              <HelperText style={Common.errorStyle} type="error" visible={error('location')}>
                {error('location')}
              </HelperText>
              <Button
                mode="contained"
                onPress={_handleSelectLocationClick}
                style={[Gutters.regularTMargin]}
                disabled={isSubmitting}
                icon="map-marker"
              >
                Select location
              </Button>

              <View style={[Layout.row, Gutters.regularTMargin]}>
                <UploadDocumentButton
                  title="Take Photo"
                  style={[Layout.fill, Gutters.tinyRMargin]}
                  disabled={isSubmitting}
                  onImageSelect={(image) => setFieldValue('imageUri', image)}
                />

                <Button
                  mode="contained"
                  style={[Layout.fill, Gutters.tinyLMargin]}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

CreateServiceRequestForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  accounts: PropTypes.array.isRequired,
  municipalities: PropTypes.object.isRequired,
};

CreateServiceRequestForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
};

export default CreateServiceRequestForm;
