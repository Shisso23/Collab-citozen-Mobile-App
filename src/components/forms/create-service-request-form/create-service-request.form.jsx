import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { ViewPropTypes, View, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux';
import {
  selectChannelSchema,
  selectServiceTypeCategorySchema,
  selectServiceTypeSchema,
  descriptionSchema,
  locationSchema,
} from '../form-validaton-schemas';
import { getFormError } from '../form-utils';
import useTheme from '../../../theme/hooks/useTheme';
import { DropdownSelect } from '../../atoms';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';
import UploadDocumentButton from '../../molecules/upload-document-button';

navigator.geolocation = require('react-native-geolocation-service');

const CreateServiceRequestForm = ({
  submitForm,
  onSuccess,
  containerStyle,
  initialValues,
  municipalities,
}) => {
  const { Common, Layout, Gutters } = useTheme();
  const { selectedAddress, region } = useSelector(locationSelector);
  const [address, setAddress] = useState('');
  let serviceTypesAvailable = false;

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  const validationSchema = Yup.object().shape({
    channel: selectChannelSchema,
    serviceTypeCategory: selectServiceTypeCategorySchema,
    serviceType: selectServiceTypeSchema,
    description: descriptionSchema,
    location: locationSchema,
  });

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
          const memoizedChannels = Object.keys(municipalities);
          const channelNames = [];

          for (let i = 0; i < Object.keys(municipalities).length; i += 1) {
            const municipalitiesData = municipalities[memoizedChannels[i]].name;
            channelNames.push(municipalitiesData);
          }

          let municipalityCodeRef = null;
          let memoizedServiceTypeCategories = null;
          let memoizedServiceTypes = null;

          if (!_.isEmpty(values.channel)) {
            for (let i = 0; i < Object.keys(municipalities).length; i += 1) {
              if (values.channel === channelNames[i]) {
                municipalityCodeRef = memoizedChannels[i];
              }
            }
          }

          if (!_.isEmpty(values.channel) && !_.isNull(municipalityCodeRef)) {
            memoizedServiceTypeCategories = Object.keys(
              municipalities[municipalityCodeRef].serviceTypes,
            );

            if (_.isEmpty(memoizedServiceTypeCategories)) {
              serviceTypesAvailable = false;
            } else {
              serviceTypesAvailable = true;
            }

            if (!_.isEmpty(values.serviceTypeCategory)) {
              memoizedServiceTypes =
                municipalities[municipalityCodeRef].serviceTypes[values.serviceTypeCategory];
            }
          }

          useEffect(() => {
            setFieldValue('location', region);
          }, [region]);

          useEffect(() => {
            setFieldValue('municipalityCode', municipalityCodeRef);
          }, [municipalityCodeRef]);

          useEffect(() => {
            setFieldValue('address', selectedAddress);
          }, [selectedAddress]);

          const handleSubmissionFormik = () => {
            if (serviceTypesAvailable === false) {
              setFieldValue('serviceTypeCategory', 'No Service Category Avaliable');
              values.serviceTypeCategory = 'No Service Category Avaliable';
              setFieldValue('serviceType', { NoServiceType: 'No Service Type Avaliable' });
              values.serviceType = { NoServiceType: 'No Service Type Avaliable' };
            }
            handleSubmit();
          };

          const error = (name) => getFormError(name, { touched, status, errors });
          return (
            <>
              <TextInput value={address} label="Location Selected" editable={false} />
              <HelperText />

              <DropdownSelect
                items={channelNames}
                label="Channel"
                keyExtractor={(item) => item}
                valueExtractor={(item) => item}
                onBlur={() => {
                  setFieldTouched('channel', true);
                }}
                placeholder="Channel"
                onChange={(municipality) => {
                  setFieldValue('channel', municipality);
                  setFieldValue('serviceType', null);
                  setFieldValue('serviceTypeCategory', '');
                }}
                value={values.channel}
                error={error('channel')}
                errorStyle={Common.errorStyle}
              />

              {serviceTypesAvailable ? (
                <DropdownSelect
                  disabled={_.isEmpty(values.channel)}
                  items={memoizedServiceTypeCategories}
                  label="Service Type Category"
                  keyExtractor={(item) => item}
                  valueExtractor={(item) => item}
                  onBlur={() => {
                    setFieldTouched('serviceTypeCategory', true);
                  }}
                  placeholder="Select Service Category"
                  onChange={(newServiceTypeCategory) => {
                    setFieldValue('serviceTypeCategory', newServiceTypeCategory);
                    setFieldValue('serviceType', null);
                  }}
                  value={values.serviceTypeCategory}
                  error={error('serviceTypeCategory')}
                  errorStyle={Common.errorStyle}
                />
              ) : null}

              {serviceTypesAvailable ? (
                <DropdownSelect
                  disabled={_.isEmpty(values.serviceTypeCategory)}
                  items={memoizedServiceTypes}
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
              ) : null}

              <TextInput
                label="Description"
                value={values.description}
                multiline
                keyboardType="default"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                blurOnSubmit
                onBlur={handleBlur('description')}
                onChangeText={handleChange('description')}
                style={[Common.textInput]}
                error={error('description')}
              />

              <HelperText style={Common.errorStyle} type="error" visible={error('description')}>
                {error('description')}
              </HelperText>

              <View style={[Layout.row]}>
                <UploadDocumentButton
                  title="Take Photo"
                  style={[Layout.fill, Gutters.tinyRMargin]}
                  disabled={isSubmitting}
                  onImageSelect={(image) => setFieldValue('imageUri', image)}
                />

                <Button
                  mode="contained"
                  style={[Layout.fill, Gutters.tinyLMargin]}
                  onPress={handleSubmissionFormik}
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
  municipalities: PropTypes.object.isRequired,
};

CreateServiceRequestForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
};

export default CreateServiceRequestForm;
