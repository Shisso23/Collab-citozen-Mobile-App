import React, { useCallback, useEffect, useState } from 'react';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect, DefaultTheme, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import _ from 'lodash';

import useTheme from '../../../../theme/hooks/useTheme';
import { locationSelector } from '../../../../reducers/location-reducer/location.reducer';
import {
  getAddressFromRegionAction,
  getCurrentPositionAction,
} from '../../../../reducers/location-reducer/location.actions';
import appConfig from '../../../../config';
import { getMunicipalitiesAction } from '../../../../reducers/municipalities-reducer/municipalities.actions';
import { getUnsubscribedChannelsByLocationAction } from '../../../../reducers/unsubscribed-channels/unsubscribed-channels.actions';
import { flashService } from '../../../../services';

const { width } = Dimensions.get('window');

const SelectLocationScreen = () => {
  const { params } = useRoute();
  const { fromSubscribedChannels, onBack, handlePickLocation } = params;
  const { Colors, Layout, Common, Gutters } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { region, selectedAddress } = useSelector(locationSelector);
  const [address, setAddress] = useState('');
  const [mapRef, setMapRef] = useState(undefined);
  const [regionChange, setRegionChange] = useState({
    ...region,
    latitudeDelta: 0.011,
    longitudeDelta: 0.011,
  });

  useFocusEffect(
    useCallback(() => {
      setRegionChange(region);
    }, [region]),
  );

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  const _handleBackPress = () => {
    if (fromSubscribedChannels) {
      navigation.navigate('ViewSubscribeToChannels');
      dispatch(getCurrentPositionAction());
    } else {
      navigation.navigate('ServiceRequests');
      dispatch(getCurrentPositionAction());
    }
  };

  const _handlePickLocation = () => {
    if (fromSubscribedChannels) {
      dispatch(
        getUnsubscribedChannelsByLocationAction(regionChange.longitude, regionChange.latitude),
      );
      return navigation.navigate('SubscribeToChannels');
    }
    return dispatch(getMunicipalitiesAction(regionChange.longitude, regionChange.latitude)).then(
      (channels) => {
        if (channels.length === 0 || Object.keys(channels).length === 0) {
          return flashService.info('There are no channels at this location!');
        }
        return navigation.navigate('CreateServiceRequest');
      },
    );
  };

  const _setRegion = async (newRegion) => {
    if (
      newRegion.latitude.toFixed(5) !== region.latitude.toFixed(5) &&
      newRegion.longitude.toFixed(5) !== region.latitude.toFixed(5)
    ) {
      const addressSelected = await dispatch(getAddressFromRegionAction(newRegion));
      setAddress(addressSelected);
      setRegionChange(newRegion);
    }
  };

  const hitSlop = { top: 20, bottom: 20, left: 20, right: 20 };

  const _handleNewRegion = (details) => {
    const location = _.get(details, 'geometry.location');
    const newRegion = {
      latitude: location.lat,
      longitude: location.lng,
      longitudeDelta: 0.011,
      latitudeDelta: 0.011,
    };
    setRegionChange(newRegion);
    mapRef.animateToRegion(newRegion);
  };

  return region ? (
    <View style={[Layout.fullSize]}>
      <View style={[Common.headerSelectLocation]}>
        <View style={[Layout.rowBetween]}>
          <IconButton
            icon="arrow-left"
            size={30}
            color={Colors.black}
            onPress={onBack || _handleBackPress}
            style={Gutters.largeTMargin}
          />

          <View style={[Layout.center]}>
            <Text style={[Gutters.largeTMargin, Common.pickLocation]}>Pick Location</Text>
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
        enableHighAccuracyLocation
        minLength={3}
        onPress={(data, details = null) => {
          _handleNewRegion(details);
        }}
        query={{
          key: appConfig.googleMapsApiKey,
          language: 'en',
          components: 'country:za',
        }}
        styles={{
          container: {
            position: 'absolute',
            width: '100%',
            marginTop: 80,
            zIndex: 1,
          },
          textInput: {
            height: 53,
          },
        }}
        textInputProps={{
          InputComp: TextInput,
          autoFocus: true,
          backgroundColor: DefaultTheme.colors.background,
          clearButtonMode: 'never',
          listViewDisplayed: true,
          underlineColor: Colors.transparent,
          autoCorrect: false,
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
        initialRegion={regionChange}
        showsUserLocation
        onPress={Keyboard.dismiss}
        ref={setMapRef}
        onRegionChangeComplete={(newRegion) => _setRegion(newRegion)}
        showsMyLocationButton={false}
      />

      <View style={[Common.pinContainer]}>
        <Icon type="ionicon" name="pin-outline" size={30} color={Colors.primary} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : ''}>
        <View style={Layout.fullWidth}>
          <TouchableHighlight onPress={handlePickLocation || _handlePickLocation}>
            <Button style={Common.buttonPickLocation} mode="contained">
              Pick this location
            </Button>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    </View>
  ) : (
    <View style={[Layout.center, Layout.fill]}>
      <ActivityIndicator size="large" animating color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  clearContainer: {
    alignSelf: 'center',
    backgroundColor: DefaultTheme.colors.background,
    height: 38,
    justifyContent: 'center',
    left: width - 35,
    position: 'absolute',
    width: 40,
  },
});

SelectLocationScreen.propTypes = {};

SelectLocationScreen.defaultProps = {};

export default SelectLocationScreen;
