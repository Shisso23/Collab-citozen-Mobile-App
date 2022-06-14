import React, { useCallback, useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import HmsMapView, { MapTypes } from '@hmscore/react-native-hms-map';
import HMSLocation from '@hmscore/react-native-hms-location';
import { Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
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
import { hasHmsSync } from 'react-native-device-info';

import useTheme from '../../../../theme/hooks/useTheme';
import { locationSelector } from '../../../../reducers/location-reducer/location.reducer';
import {
  getAddressFromRegionAction,
  getCurrentPositionAction,
} from '../../../../reducers/location-reducer/location.actions';
import appConfig from '../../../../config';
import { getMunicipalitiesAction } from '../../../../reducers/municipalities-reducer/municipalities.actions';
import { getUnsubscribedChannelsByLocationAction } from '../../../../reducers/unsubscribed-channels/unsubscribed-channels.actions';
import { flashService, permissionsService } from '../../../../services';
import LoadingOverlay from '../../../../components/molecules/loading-overlay';

const { width } = Dimensions.get('window');
const loadingImageSource = require('../../../../assets/lottie-files/rings-loading.json');

const SelectLocationScreen = () => {
  const { params } = useRoute();
  const { fromSubscribedChannels, onBack, handlePickLocation } = params;
  const { Colors, Layout, Common, Gutters } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { region, selectedAddress, isLoadingAddress } = useSelector(locationSelector);
  const [userLocation, setUserLocation] = useState(region);
  const [mapPosition, setMapPosition] = useState(userLocation);
  const [address, setAddress] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(
    !mapReady || !locationPermission || !userLocation,
  );
  const [loadingModalTransparent, setLoadingModalTransparent] = useState(false);
  const [mapRef, setMapRef] = useState(undefined);
  const [hmsMapRef, setHmsMapRef] = useState(undefined);

  useEffect(() => {
    if (hasHmsSync()) {
      HMSLocation.LocationKit.Native.init()
        .then((resp) => resp)
        .catch((err) => alert(err.message));
    }
  }, []);

  useEffect(() => {
    if (region && mapReady && locationPermission && !isLoadingAddress) {
      setLoadingModalVisible(false);
    }
  }, [JSON.stringify(region), mapReady, locationPermission, isLoadingAddress]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentPositionAction()).then((position) => {
        setUserLocation(position);
        setMapPosition(position);
        dispatch(getAddressFromRegionAction(position)).then((addressSelected) => {
          setAddress(addressSelected);
        });
      });
      if (hasHmsSync()) {
        permissionsService
          .requestHmsLocationPermissions()
          .then((result) => {
            setLocationPermission(result);
          })
          .catch(() => {
            flashService.error('Please grant permissions to select a location.');
          });
      } else {
        permissionsService
          .checkLocationPermissions()
          .then((result) => {
            setLocationPermission(result);
          })
          .catch(() => {
            flashService.error('Please grant permissions to select a location.');
          });
      }
    }, []),
  );

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  const _handleBackPress = async () => {
    if (fromSubscribedChannels) {
      navigation.navigate('ViewSubscribeToChannels');
    } else {
      navigation.navigate('ServiceRequests');
    }
  };

  const _handlePickLocation = () => {
    if (fromSubscribedChannels) {
      dispatch(
        getUnsubscribedChannelsByLocationAction(mapPosition.longitude, mapPosition.latitude),
      );
      return navigation.navigate('SubscribeToChannels');
    }
    return dispatch(getMunicipalitiesAction(mapPosition.longitude, mapPosition.latitude)).then(
      (channels) => {
        if (channels.length === 0 || Object.keys(channels).length === 0) {
          return flashService.info('There are no available channels that allow service requests.');
        }
        return navigation.navigate('CreateServiceRequest');
      },
    );
  };

  const _setMapPosition = async (newMapPositionCordinates) => {
    if (
      userLocation &&
      newMapPositionCordinates.latitude.toFixed(5) !== userLocation.latitude.toFixed(5) &&
      newMapPositionCordinates.longitude.toFixed(5) !== userLocation.latitude.toFixed(5)
    ) {
      setMapPosition(newMapPositionCordinates);
    }
  };

  const hitSlop = { top: 20, bottom: 20, left: 20, right: 20 };

  const _handleNewRegionFromSearch = async (details) => {
    setLoadingModalVisible(true);
    const location = _.get(details, 'geometry.location');
    const newRegionCoordinates = {
      latitude: location.lat,
      longitude: location.lng,
      longitudeDelta: 0.011,
      latitudeDelta: 0.011,
    };
    setAddress(_.getdetails, 'name', '');
    setLoadingModalTransparent(true);
    await dispatch(getAddressFromRegionAction(newRegionCoordinates)).then((adressSelected) => {
      setAddress(adressSelected);
      setLoadingModalTransparent(false);
    });
    setMapPosition(newRegionCoordinates);
    if (!hasHmsSync()) {
      mapRef.animateToRegion(newRegionCoordinates);
    } else {
      hmsMapRef.setCameraPosition({ target: newRegionCoordinates, zoom: 15, tilt: 40 });
    }
  };

  return (
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
        onPress={async (data, details = null) => {
          await _handleNewRegionFromSearch(details);
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
      {hasHmsSync() ? (
        <HmsMapView
          ref={(e) => {
            setHmsMapRef(e);
          }}
          style={Layout.fill}
          mapType={MapTypes.NORMAL}
          camera={{
            target: userLocation,
            zoom: 15,
          }}
          onMapReady={() => setMapReady(true)}
          onCameraIdle={(event) => {
            event.persist();
            _setMapPosition(event.nativeEvent.target);
            hmsMapRef.stopAnimation();
          }}
          minZoomPreference={3}
          maxZoomPreference={20}
          animationDuration={2000}
          zoomControlsEnabled
          rotateGesturesEnabled
          scrollGesturesEnabled
          tiltGesturesEnabled
          zOrderOnTop={false}
          zoomGesturesEnabled
          myLocationEnabled={false}
          myLocationButtonEnabled={false}
          markerClustering={false}
          scrollGesturesEnabledDuringRotateOrZoom
          useAnimation
        />
      ) : (
        <MapView
          style={[Layout.fill]}
          initialRegion={userLocation}
          showsUserLocation
          onPress={Keyboard.dismiss}
          ref={setMapRef}
          onMapReady={() => setMapReady(true)}
          onRegionChangeComplete={(newRegion) => {
            return _setMapPosition(newRegion);
          }}
          showsMyLocationButton={false}
          zoomControlEnabled
          zoomEnabled
        />
      )}

      <View style={[Common.pinContainer]}>
        <Icon type="ionicon" name="pin-outline" size={30} color={Colors.primary} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : ''}>
        <View style={Layout.fullWidth}>
          <TouchableHighlight
            onPress={handlePickLocation ? handlePickLocation(mapPosition) : _handlePickLocation}
          >
            <Button style={Common.buttonPickLocation} mode="contained">
              Pick this location
            </Button>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
      <LoadingOverlay
        source={loadingImageSource}
        visible={loadingModalVisible}
        onBackDropPress={() => setLoadingModalVisible(false)}
        transparent={loadingModalTransparent}
      />
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
