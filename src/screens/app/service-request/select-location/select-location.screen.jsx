/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import MapView, { Marker } from 'react-native-maps';
import HmsMapView, { MapTypes, HMSMarker, Hue } from '@hmscore/react-native-hms-map';
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
  StatusBar,
} from 'react-native';
import { Button, TextInput, IconButton, Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect, DefaultTheme, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import _ from 'lodash';
import { hasGmsSync, hasHmsSync } from 'react-native-device-info';

import useTheme from '../../../../theme/hooks/useTheme';
import { locationSelector } from '../../../../reducers/location-reducer/location.reducer';
import {
  getAddressFromRegionAction,
  getCurrentPositionAction,
} from '../../../../reducers/location-reducer/location.actions';
import { getNearbyPinLocationsAction } from '../../../../reducers/service-request-reducer/service-request.actions';
import appConfig from '../../../../config';
import { getMunicipalitiesAction } from '../../../../reducers/municipalities-reducer/municipalities.actions';
import { getUnsubscribedChannelsByLocationAction } from '../../../../reducers/unsubscribed-channels/unsubscribed-channels.actions';
import { flashService, permissionsService, serviceRequestService } from '../../../../services';
import LoadingOverlay from '../../../../components/molecules/loading-overlay';
import { Colors } from '../../../../theme/Variables';

const { width } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const loadingImageSource = require('../../../../assets/lottie-files/rings-loading.json');

const SelectLocationScreen = () => {
  const { params } = useRoute();
  const { fromSubscribedChannels, onBack, handlePickLocation, showSRPins } = params;
  const { Layout, Common, Gutters, Fonts, FontSize } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { region, selectedAddress, isLoadingAddress } = useSelector(locationSelector);
  const { user } = useSelector((reducers) => reducers.userReducer);
  const [nearbyPinLocations, setNearbyPinLocations] = useState([]);
  const [pinsModalVisible, setPinsModalVisible] = useState(false);
  const [selectedSRPin, setSelectedSRPin] = useState({});
  const [isLoadingFollowSR, setIsLoadingFollowSR] = useState(false);
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
  const [keyboardVisible, setKeyboardVisible] = useState(undefined);
  const [hmsMapRef, setHmsMapRef] = useState(undefined);

  useEffect(() => {
    if (region && mapReady && locationPermission && userLocation && !isLoadingAddress) {
      setLoadingModalVisible(false);
    }
  }, [
    JSON.stringify(region),
    mapReady,
    locationPermission,
    JSON.stringify(userLocation),
    isLoadingAddress,
  ]);

  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });
      if (hasGmsSync() || Platform.OS === 'ios') {
        permissionsService
          .checkLocationPermissions()
          .then((result) => {
            setLocationPermission(result);
          })
          .catch(() => {
            flashService.error('Please grant permissions to select a location.');
          });
      } else if (hasHmsSync()) {
        permissionsService
          .requestHmsLocationPermissions()
          .then((result) => {
            setLocationPermission(result);
          })
          .catch(() => {
            flashService.error('Please grant permissions to select a location.');
          });
      }
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []),
  );

  useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      throttleGetPinLocations(mapPosition?.latitude, mapPosition?.longitude);
    }, [JSON.stringify(mapPosition)]),
  );

  const throttleGetPinLocations = useMemo(
    () =>
      _.throttle(
        (currentLatitude, currentLongitude) =>
          getNearbyPinLocations(currentLatitude, currentLongitude),
        500,
        undefined,
      ),
    [],
  );

  const handleFollowSR = (serviceRequestObjId, following) => {
    setIsLoadingFollowSR(true);
    serviceRequestService
      .followServiceRequest({
        userId: user.user_id,
        serviceRequestId: serviceRequestObjId,
        followed: following,
      })
      .then(async () => {
        setSelectedSRPin({ ...selectedSRPin, following });
        await getNearbyPinLocations(mapPosition?.latitude, mapPosition?.longitude);
      })
      .finally(() => {
        setIsLoadingFollowSR(false);
      });
  };

  const getNearbyPinLocations = async (currentLatitude, currentLongitude) => {
    dispatch(getNearbyPinLocationsAction(currentLatitude, currentLongitude)).then(
      (nearbyPinLocationsResponse) => {
        setNearbyPinLocations(nearbyPinLocationsResponse.payload);
      },
    );
  };

  const returnMarkerColour = (serviceRequestStatus) => {
    switch (serviceRequestStatus) {
      case 'Initial':
        return hasGmsSync() || Platform.OS === 'ios'
          ? Colors.lightOrange
          : hasHmsSync()
          ? Hue.ORANGE
          : null;
      case 'Registered':
        return hasGmsSync() || Platform.OS === 'ios'
          ? Colors.lightBlue
          : hasHmsSync()
          ? Hue.CYAN
          : null;
      case 'Completed':
        return hasGmsSync() || Platform.OS === 'ios'
          ? Colors.primary
          : hasHmsSync()
          ? Hue.BLUE
          : null;
      case 'Assigned':
        return hasGmsSync() || Platform.OS === 'ios'
          ? Colors.lightGreen
          : hasHmsSync()
          ? Hue.GREEN
          : null;
      default:
        return hasGmsSync() || Platform.OS === 'ios'
          ? Colors.gray
          : hasHmsSync()
          ? Hue.VIOLET
          : null;
    }
  };

  const displayPins = () => {
    return nearbyPinLocations?.map((pin, index) => {
      const { gpsCoordinates } = pin;
      const cordinates = gpsCoordinates
        .substring(gpsCoordinates.indexOf('(') + 1, gpsCoordinates.indexOf(')'))
        .split(' ');
      const lat = parseFloat(cordinates[0]);
      const lng = parseFloat(cordinates[1]);

      return hasGmsSync() || Platform.OS === 'ios' ? (
        <Marker
          coordinate={{ latitude: lng, longitude: lat }}
          onPress={displayModalToggle(pin, true)}
          key={`${pin.id}-${index}`}
        >
          <View style={styles.pin}>
            <Icon name="location-pin" size={45} color={returnMarkerColour(pin.status)} />
          </View>
        </Marker>
      ) : hasHmsSync() ? (
        <HMSMarker
          key={pin.id}
          icon={{ hue: returnMarkerColour(pin.status) }}
          clusterable
          defaultActionOnClick={false}
          coordinate={{ latitude: lng, longitude: lat }}
          onClick={displayModalToggle(pin, true)}
        />
      ) : (
        <View />
      );
    });
  };

  const renderFollowSRButon = () => {
    const { id, following, ownerId } = selectedSRPin;
    return (
      (user.user_id?.trim() !== ownerId?.trim() && (
        <Button
          mode="contained"
          style={[
            Gutters.regularBMargin,
            ...[{ width: '40%' }],
            FontSize.small,
            Layout.alignSelfEnd,
          ]}
          color={Colors.primary}
          onPress={() => handleFollowSR(id, !following)}
          loading={isLoadingFollowSR}
          disabled={isLoadingFollowSR}
        >
          {following ? 'UnFollow' : 'Follow'}
        </Button>
      )) || <></>
    );
  };

  const pinDetailsModal = () => {
    const { id, serviceType, serviceDescription, requestDate, status } = selectedSRPin;
    return (
      <Modal visible={pinsModalVisible} transparent>
        <TouchableOpacity
          style={[Layout.alignItemsCenter, Layout.justifyContentCenter, styles.modal]}
          activeOpacity={1}
          onPress={() => setPinsModalVisible(false)}
        >
          <View
            style={[
              Layout.itemsEnd,
              Layout.justifyCenter,
              Gutters.largeHMargin,
              ...[
                {
                  maxHeight: '50%',
                },
              ],
              Fonts.textRegular,
            ]}
          >
            <TouchableOpacity
              style={[
                ...[{ backgroundColor: Colors.gray, width: 40, height: 40 }],
                Layout.alignSelfEnd,
                Gutters.regularMargin,
              ]}
              onPress={() => setPinsModalVisible(false)}
            >
              <Icon name="close" size={30} color={Colors.lightgray} />
            </TouchableOpacity>

            <View
              style={[
                styles.modalView,
                Gutters.smallPadding,
                { backgroundColor: Colors.lightgray },
              ]}
            >
              <Text style={[Gutters.smallVMargin, Fonts.textRegular, styles.headerFont]}>
                Type: {serviceType}
              </Text>
              <View style={styles.textLine} />
              <Text style={[Gutters.smallVMargin, Fonts.textRegular, styles.descriptionFont]}>
                Description:
              </Text>
              <Text numberOfLines={4} style={[Gutters.smallBMargin, Fonts.textRegular]}>
                {serviceDescription}
              </Text>
              <View style={styles.textLine} />
              <Text style={[Gutters.smallVMargin, Fonts.textRegular]}>Status: {status}</Text>
              <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>Date: {requestDate}</Text>
              <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>Reference No: {id}</Text>
              {renderFollowSRButon()}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const displayModalToggle = (pin, modalVisible) => () => {
    setPinsModalVisible(modalVisible);
    setSelectedSRPin(pin);
  };

  useEffect(() => {
    if ((hasGmsSync() || Platform.OS === 'ios') && mapRef) {
      mapRef.animateToRegion(mapPosition);
    } else if (hasHmsSync() && hmsMapRef) {
      hmsMapRef.setCameraPosition({ target: mapPosition, zoom: 15, tilt: 40 });
    }
  }, [JSON.stringify(`${mapRef}`), JSON.stringify(`${hmsMapRef}`)]);

  useEffect(() => {
    dispatch(getCurrentPositionAction()).then(async (position) => {
      setUserLocation(position);
      setMapPosition(position);
      await _setMapPosition(position);
      dispatch(getAddressFromRegionAction(position)).then((addressSelected) => {
        setAddress(addressSelected);
      });
    });
  }, []);

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
    setLoadingModalTransparent(true);
    setLoadingModalVisible(true);
    if (fromSubscribedChannels) {
      return dispatch(
        getUnsubscribedChannelsByLocationAction(mapPosition.longitude, mapPosition.latitude),
      )
        .then(() => {
          return navigation.navigate('SubscribeToChannels');
        })
        .finally(() => {
          setLoadingModalVisible(false);
          setLoadingModalTransparent(false);
        });
    }
    return dispatch(getMunicipalitiesAction(mapPosition.longitude, mapPosition.latitude))
      .then((channels) => {
        if (channels.length === 0 || Object.keys(channels).length === 0) {
          return flashService.info('There are no available channels that allow service requests.');
        }
        return navigation.navigate('CreateServiceRequest', {
          selectedAddress,
          mapPosition,
        });
      })
      .finally(() => {
        setLoadingModalVisible(false);
        setLoadingModalTransparent(false);
      });
  };

  const _setMapPosition = async (newMapPositionCordinates) => {
    if (
      userLocation &&
      newMapPositionCordinates.latitude.toFixed(5) !== userLocation.latitude.toFixed(5) &&
      newMapPositionCordinates.longitude.toFixed(5) !== userLocation.latitude.toFixed(5)
    ) {
      dispatch(getAddressFromRegionAction(newMapPositionCordinates)).then((addressSelected) => {
        setAddress(addressSelected);
      });
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
    setAddress(_.get(details, 'formatted_address', ''));
    setLoadingModalTransparent(true);
    await dispatch(getAddressFromRegionAction(newRegionCoordinates)).then((adressSelected) => {
      setAddress(adressSelected);
      setLoadingModalTransparent(false);
    });
    setMapPosition(newRegionCoordinates);
    if (hasGmsSync() || Platform.OS === 'ios') {
      mapRef.animateToRegion(newRegionCoordinates);
    } else if (hasHmsSync()) {
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
      {(hasGmsSync() || Platform.OS === 'ios') && locationPermission && userLocation ? (
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
          showsMyLocationButton
          zoomControlEnabled
          zoomEnabled
        >
          {showSRPins && nearbyPinLocations.length > 0 ? displayPins() : <></>}
        </MapView>
      ) : hasHmsSync() && locationPermission && userLocation ? (
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
          // maxZoomPreference={50}
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
        >
          {showSRPins && nearbyPinLocations?.length > 0 ? displayPins() : <></>}
        </HmsMapView>
      ) : (
        <View />
      )}

      <View style={[Common.pinContainer]}>
        <Icon type="ionicon" name="pin-outline" size={30} color={Colors.primary} />
      </View>

      {Platform.OS === 'android' && (
        <View
          style={[
            ...[{ paddingBottom: !keyboardVisible ? screenHeight - screenHeight * 0.91 : 0 }],
          ]}
        >
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
        </View>
      )}

      {Platform.OS === 'ios' && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : ''}
          contentContainerStyle={[
            ...[{ paddingBottom: !keyboardVisible ? screenHeight - screenHeight * 0.885 : 0 }],
          ]}
        >
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
      )}

      {pinDetailsModal()}
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
  descriptionFont: {
    fontSize: 16,
  },
  headerFont: {
    fontSize: 19,
  },
  modal: { backgroundColor: Colors.transparent, height: '100%', width: '100%' },
  modalView: {
    backgroundColor: Colors.black,
    borderRadius: 15,
    paddingLeft: 10,
  },
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLine: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    width: 315,
  },
});

SelectLocationScreen.propTypes = {};

SelectLocationScreen.defaultProps = {};

export default SelectLocationScreen;
