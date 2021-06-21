/* eslint-disable */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { ViewPropTypes, View, Keyboard, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HelperText, TextInput, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
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
import { DropdownSelect, CheckBoxTick } from '../../atoms';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';
import UploadDocumentButton from '../../molecules/upload-document-button';

navigator.geolocation = require('react-native-geolocation-service');

const SubscribeToChannelsForm = ({
  submitForm,
  onSuccess,
  containerStyle,
  initialValues,
  municipalities,
}) => {
  const { Common, Layout, Gutters, Colors } = useTheme();
  const { selectedAddress, region } = useSelector(locationSelector);
  const [address, setAddress] = useState('');
  const navigation = useNavigation();
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

  const newsFeedDummyObject = {
    dummyId: 1,
    title: 'Buffalo City (East London)',
    subscribed: false,
  };

  const newsFeedDummyObject2 = {
    dummyId: 2,
    title: 'City of Cape Town',
    subscribed: false,
  };

  const dummyarray = [];
  dummyarray.push(newsFeedDummyObject);
  dummyarray.push(newsFeedDummyObject2);

  const subscribeToItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item title={item.title} right={() => <CheckBoxTick />} titleNumberOfLines={1} />
      </View>
    );
  };

  return (
    <>
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
                <TextInput
                  value={address}
                  label="Location Selected"
                  underlineColor={Colors.transparent}
                  onFocus={() => navigation.navigate('SelectLocationScreen')}
                />
                <HelperText />

                <FlatList
                  data={dummyarray}
                  renderItem={subscribeToItem}
                  keyExtractor={(item) => String(item.dummyId)}
                />

                <HelperText />

                <Button
                  mode="contained"
                  style={[Layout.fill, Gutters.tinyLMargin]}
                  onPress={handleSubmissionFormik}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Subscribe
                </Button>
              </>
            );
          }}
        </Formik>
      </View>
    </>
  );
};

SubscribeToChannelsForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  municipalities: PropTypes.object.isRequired,
};

SubscribeToChannelsForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
};

export default SubscribeToChannelsForm;
