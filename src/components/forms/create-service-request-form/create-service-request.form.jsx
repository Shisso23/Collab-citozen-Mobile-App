import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { ViewPropTypes, View } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { useSelector } from 'react-redux';
import {
  selectMunicipalitySchema,
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

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  const validationSchema = Yup.object().shape({
    channel: selectMunicipalitySchema,
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
          const memiozedChannels = Object.keys(municipalities);

          const channelNames = [];
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < Object.keys(municipalities).length; i++) {
            const dataa = municipalities[memiozedChannels[i]].name;

            channelNames.push(dataa);
          }

          let refCode = null;
          let memiozedServiceTypeCategories = null;
          let memiozedServiceTypes = null;

          if (values.channel !== '') {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < Object.keys(municipalities).length; i++) {
              if (values.channel === channelNames[i]) {
                refCode = memiozedChannels[i];
              }
            }
          }

          if (values.channel !== '') {
            memiozedServiceTypeCategories = Object.keys(municipalities[refCode].serviceTypes);

            if (values.serviceTypeCategory !== '') {
              memiozedServiceTypes =
                municipalities[refCode].serviceTypes[values.serviceTypeCategory];
            }
          }

          useEffect(() => {
            setFieldValue('location', region);
          }, [region]);

          const error = (name) => getFormError(name, { touched, status, errors });
          return (
            <>
              <TextInput value={address} label="Location Selected" editable={false} />
              <HelperText />

              <DropdownSelect
                items={channelNames}
                label="Municipality"
                keyExtractor={(item) => item}
                valueExtractor={(item) => item}
                onBlur={() => {
                  setFieldTouched('channel', true);
                }}
                placeholder="Municipality"
                onChange={(municipality) => {
                  setFieldValue('channel', municipality);
                  setFieldValue('serviceTypeCategory', '');
                  setFieldValue('serviceType', null);
                }}
                value={values.channel}
                error={error('channel')}
                errorStyle={Common.errorStyle}
              />

              <DropdownSelect
                disabled={_.isEmpty(values.channel)}
                items={memiozedServiceTypeCategories}
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

              <DropdownSelect
                disabled={_.isEmpty(values.serviceTypeCategory)}
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
  municipalities: PropTypes.object.isRequired,
};

CreateServiceRequestForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
};

export default CreateServiceRequestForm;
