import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import SelectLocation from '../../../components/molecules/select-location';
import { getContactDetailsAction } from '../../../reducers/contacts-reducer/contacts.actions';

const LocateContactsChannelScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [regionChange, setRegionChange] = useState(null);
  const { contactDetails } = useSelector((reducers) => reducers.contactsReducer);

  const _handleBackPress = () => {
    navigation.goBack();
  };

  const _handlePickLocation = () => {
    dispatch(
      getContactDetailsAction({
        longitude: regionChange.longitude,
        latitude: regionChange.latitude,
      }),
    );
    return navigation.navigate('ContactDetails', { contactDetails });
  };

  return (
    <SelectLocation
      _handleBackPress={_handleBackPress}
      _handlePickLocation={_handlePickLocation}
      onRegionChange={setRegionChange}
    />
  );
};

export default LocateContactsChannelScreen;
