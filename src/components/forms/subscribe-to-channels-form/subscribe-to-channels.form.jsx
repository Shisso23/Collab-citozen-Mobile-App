import React, { useEffect, useState } from 'react';
import { ViewPropTypes, View, FlatList } from 'react-native';
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
import useTheme from '../../../theme/hooks/useTheme';
import { CheckBoxTick } from '../../atoms';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';

navigator.geolocation = require('react-native-geolocation-service');

const SubscribeToChannelsForm = ({ submitForm, onSuccess, containerStyle, initialValues }) => {
  const { Common, Layout, Gutters, Colors } = useTheme();
  const { selectedAddress } = useSelector(locationSelector);
  const [address, setAddress] = useState('');
  const navigation = useNavigation();
  const serviceTypesAvailable = false;

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
          {({ handleSubmit, values, isSubmitting, setFieldValue }) => {
            const handleSubmissionFormik = () => {
              if (serviceTypesAvailable === false) {
                setFieldValue('serviceTypeCategory', 'No Service Category Avaliable');
                values.serviceTypeCategory = 'No Service Category Avaliable';
                setFieldValue('serviceType', { NoServiceType: 'No Service Type Avaliable' });
                values.serviceType = { NoServiceType: 'No Service Type Avaliable' };
              }
              handleSubmit();
            };

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
};

SubscribeToChannelsForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
};

export default SubscribeToChannelsForm;
