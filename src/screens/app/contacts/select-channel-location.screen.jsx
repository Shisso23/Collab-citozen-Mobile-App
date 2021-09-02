import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import useTheme from '../../../theme/hooks/useTheme';
import SelectLocation from '../../../components/molecules/select-location';
import { getContactDetailsAction } from '../../../reducers/contacts-reducer/contacts.actions';

const LocateContactsChannelScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [regionChange, setRegionChange] = useState(null);
  const { contactDetails } = useSelector((reducers) => reducers.contactsReducer);
  const { Layout, Images } = useTheme();

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
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <SelectLocation
          _handleBackPress={_handleBackPress}
          _handlePickLocation={_handlePickLocation}
          onRegionChange={setRegionChange}
        />
      </ImageBackground>
    </>
  );
};

export default LocateContactsChannelScreen;
