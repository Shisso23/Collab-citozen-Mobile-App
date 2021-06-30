import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { ViewPropTypes, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, HelperText, TextInput, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { flashService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';
import { CheckBoxTick } from '../../atoms';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';

navigator.geolocation = require('react-native-geolocation-service');

const SubscribeToChannelsForm = ({
  submitForm,
  onSuccess,
  containerStyle,
  initialValues,
  municipalities,
}) => {
  const { Common, Layout, Gutters, Colors } = useTheme();
  const { selectedAddress } = useSelector(locationSelector);
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  const _handleFormSubmitError = (error, actions) => {
    actions.setSubmitting(false);
    flashService.error(error);
  };

  const _handleSubmission = (formData, actions) => {
    if (_.isEmpty(formData.channels)) {
      flashService.error('No Channels selected');
      actions.setSubmitting(false);
    } else if (!_.isEmpty(formData.channels)) {
      submitForm(formData)
        .then(() => {
          actions.setSubmitting(false);
          onSuccess();
        })
        .catch((error) => _handleFormSubmitError(error, actions, formData));
    }
  };

  const subscriptionList = [];

  const updateSubscriptionList = (itemPass) => {
    if (itemPass.present) {
      subscriptionList.push(itemPass.selectedItem);
    } else if (!itemPass.present) {
      subscriptionList.splice(subscriptionList.indexOf(itemPass.selectedItem), 1);
    }
  };

  const subscribeToItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.name}
          right={() => <CheckBoxTick selectedItem={item} setItem={updateSubscriptionList} />}
          titleNumberOfLines={2}
        />
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
        >
          {({ isSubmitting, handleSubmit, setFieldValue }) => {
            const memoizedChannels = Object.keys(municipalities);
            const channels = [];

            for (let i = 0; i < Object.keys(municipalities).length; i += 1) {
              const municipalitiyId = municipalities[memoizedChannels[i]].id;
              const municipalityName = municipalities[memoizedChannels[i]].name;
              const municipalityAccNoApplicable =
                municipalities[memoizedChannels[i]].accountNoApplicable;
              channels.push({
                ObjId: municipalitiyId,
                name: municipalityName,
                accountNoApplicable: municipalityAccNoApplicable,
              });
            }

            const handleSub = () => {
              setFieldValue('channels', subscriptionList);
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
                  data={channels}
                  renderItem={subscribeToItem}
                  keyExtractor={(item) => String(item.ObjId)}
                />
                <HelperText />
                <Button
                  mode="contained"
                  style={[Layout.fill, Gutters.tinyLMargin]}
                  onPress={handleSub}
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
