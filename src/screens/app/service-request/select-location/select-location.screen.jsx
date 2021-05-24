/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect, DefaultTheme } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import _ from 'lodash';

import useTheme from '../../../../theme/hooks/useTheme';
import { locationSelector } from '../../../../reducers/location-reducer/location.reducer';
import {
  getAddressFromRegionAction,
  getCurrentPositionAction,
} from '../../../../reducers/location-reducer/location.actions';
import appConfig from '../../../../config';

const { width } = Dimensions.get('window');
const SelectLocationScreen = () => {
  const { Colors, Layout, Common, Gutters } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { region, selectedAddress } = useSelector(locationSelector);

  const [address, setAddress] = useState('');
  const [regionChange, setRegionChange] = useState({
    latitude: 30.5595,
    longitude: 22.9375,
    latitudeDelta: 0.011,
    longitudeDelta: 0.011,
  });

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getCurrentPositionAction());
    }, []),
  );

  useEffect(() => {
    setRegionChange(region);
  }, [region]);

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  const _handleBackPress = () => {
    navigation.navigate('ServiceRequests');
    dispatch(getCurrentPositionAction());
  };

  const _handlePickLocation = () => {
    navigation.navigate('CreateServiceRequest');
  };

  const _setRegion = (newRegion) => {
    if (
      newRegion.latitude.toFixed(5) !== region.latitude.toFixed(5) &&
      newRegion.longitude.toFixed(5) !== region.latitude.toFixed(5)
    ) {
      dispatch(getAddressFromRegionAction(newRegion));
      setAddress(selectedAddress);
      setRegionChange(newRegion);
    }
  };

  const hitSlop = { top: 20, bottom: 20, left: 20, right: 20 };

  const _handleNewRegion = (details) => {
    const newRegion = _.get(details, 'geometry.location');
    setRegionChange({
      latitude: newRegion.lat,
      longitude: newRegion.lng,
      longitudeDelta: 0.011,
      latitudeDelta: 0.011,
    });
  };

  return region ? (
    <View style={[Layout.fullSize]}>
      <View style={[Common.headerSearch]}>
        <View style={[Layout.rowBetween]}>
          <IconButton
            icon="arrow-left"
            size={30}
            color={Colors.black}
            onPress={_handleBackPress}
            style={Gutters.largeTMargin}
          />

          <View style={[Layout.center]}>
            <Text style={Gutters.largeTMargin}>Pick Location</Text>
          </View>

          <View style={[Layout.center]}>
            <IconButton
              icon="map-marker-circle"
              size={30}
              color={Colors.transparent}
              style={Gutters.largeTMargin}
            />
          </View>
        </View>
      </View>

      <GooglePlacesAutocomplete
        placeholder="Location"
        enablePoweredByContainer={false}
        debounce={3}
        fetchDetails
        onPress={(data, details = null) => {
          _handleNewRegion(details);
        }}
        query={{
          key: appConfig.googleMapsApiKey,
          language: 'en',
          components: 'country:za',
        }}
        enableHighAccuracyLocation
        minLength={3}
        styles={{
          container: {
            position: 'absolute',
            width: '100%',
            marginTop: 80,
            zIndex: 1,
          },
          listView: { backgroundColor: 'white' },
          textInput: {
            height: 53,
          },
        }}
        textInputProps={{
          InputComp: TextInput,
          autoFocus: true,
          backgroundColor: DefaultTheme.colors.background,
          color: Colors.darkgray,
          clearButtonMode: 'never',
          listViewDisplayed: true,
          underlineColor: Colors.transparent,
          onChangeText: (text) => {
            setAddress(text);
          },
          value: address,
        }}
        renderRightButton={() => (
          <TouchableOpacity
            style={styles.clearContainer}
            hitSlop={hitSlop}
            onPress={() => {
              setAddress('');
            }}
          >
            <Icon name="clear" size={15} color={Colors.black} />
          </TouchableOpacity>
        )}
      />

      <MapView
        style={[Layout.fill]}
        initialRegion={region}
        region={regionChange}
        showsUserLocation
        onPress={Keyboard.dismiss}
        onRegionChangeComplete={(newRegion) => _setRegion(newRegion)}
        showsMyLocationButton={false}
      />

      <View style={styles.pinContainer}>
        <Icon type="ionicon" name="pin-outline" size={30} color={Colors.primary} />
      </View>

      <View style={[Layout.fullWidth, styles.buttonContainer]}>
        <TouchableHighlight onPress={_handlePickLocation}>
          <Button style={{ height: 70, justifyContent: 'center' }} mode="contained">
            Pick this location
          </Button>
        </TouchableHighlight>
      </View>
    </View>
  ) : (
    <View style={[Layout.center, Layout.fill]}>
      <ActivityIndicator size="large" animating color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: 0,
    position: 'absolute',
  },
  clearContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: DefaultTheme.colors.background,
    height: 38,
    justifyContent: 'center',
    left: width - 35,
    position: 'absolute',
    width: 40,
  },
  pinContainer: {
    left: '47%',
    position: 'absolute',
    top: '53%',
  },
});

SelectLocationScreen.propTypes = {};

SelectLocationScreen.defaultProps = {};

export default SelectLocationScreen;
