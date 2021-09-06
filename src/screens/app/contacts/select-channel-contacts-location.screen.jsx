import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import SelectLocation from '../../../components/molecules/select-location';
import { getChannelsContactsAction } from '../../../reducers/contacts-reducer/contacts.actions';

const selectChannelContactsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { params } = route;
  const { initialCoords } = params;
  const dispatch = useDispatch();
  const [regionChange, setRegionChange] = useState(null);

  const _handleBackPress = () => {
    navigation.navigate('ContactDetails');
  };

  const _handlePickLocation = () => {
    dispatch(
      getChannelsContactsAction({
        longitude: regionChange.longitude,
        latitude: regionChange.latitude,
      }),
    );
    return navigation.navigate('ContactDetails');
  };

  return (
    <SelectLocation
      _handleBackPress={_handleBackPress}
      _handlePickLocation={_handlePickLocation}
      onRegionChange={setRegionChange}
      inititialCoords={initialCoords}
    />
  );
};

export default selectChannelContactsScreen;
