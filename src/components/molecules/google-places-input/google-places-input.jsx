import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import appConfig from '../../../config';

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      fetchDetails
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log('DIt is die data', data, details);
      }}
      query={{
        key: appConfig.googleMapsApiKey,
        language: 'en',
      }}
      minLength={4}
    />
  );
};

export default GooglePlacesInput;
