import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import HmsMapView, { HMSMarker, MapTypes, Hue, HMSInfoWindow } from '@hmscore/react-native-hms-map';
import { FAB, Modal, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  Text,
  RefreshControl,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
  Keyboard,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import { Tab, Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { hasGmsSync, hasHmsSync } from 'react-native-device-info';

import useTheme from '../../../theme/hooks/useTheme';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import {
  deleteServiceRequestAction,
  getServiceRequestsAction,
  previewDeleteServiceRequestAction,
  getNearbyPinLocationsAction,
} from '../../../reducers/service-request-reducer/service-request.actions';
import { flashService, permissionsService, serviceRequestService } from '../../../services';
import ServiceRequestItem from '../../../components/molecules/service-request-item';
import SwipeRowContainer from '../../../components/atoms/swipe-row/swipe-row';
import { promptConfirm } from '../../../helpers/prompt.helper';
import { TrashButton } from '../../../components/atoms';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';
import { getCurrentPositionAction } from '../../../reducers/location-reducer/location.actions';
import LoadingOverlay from '../../../components/molecules/loading-overlay/index';

const { Colors } = useTheme();
const loadingImageSource = require('../../../assets/lottie-files/rings-loading.json');

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    serviceRequests,
    isLoadingServiceRequests,
    isLoadingDeleteServiceRequest,
    deleteServiceRequestPreview,
  } = useSelector(serviceRequestSelector);
  const { Common, Gutters, Fonts, Layout, Images, FontSize } = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const { region } = useSelector(locationSelector);
  const { user } = useSelector((reducers) => reducers.userReducer);

  const [pinsModalVisible, setPinsModalVisible] = useState(false);
  const [nearbyPinLocations, setNearbyPinLocations] = useState([]);
  const [locationPermission, setLocationPermission] = useState(false);
  const [selectedSRPin, setSelectedSRPin] = useState({});
  const [userLocation, setUserLocation] = useState(region);
  const [isLoadingFollowSR, setIsLoadingFollowSR] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapPosition, setMapPosition] = useState(userLocation);
  const [loadingModalVisible, setLoadingModalVisible] = useState(
    !mapReady || !locationPermission || !userLocation,
  );
  const initialTarget = userLocation || {
    latitude: 38.68551,
    longitude: -101.07332,
    latitudeDelta: 0.011,
    longitudeDelta: 0.011,
  };

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

  const getNearbyPinLocations = async (currentLatitude, currentLongitude) => {
    const nearbyPinLocationsResponse = await dispatch(
      getNearbyPinLocationsAction(currentLatitude, currentLongitude),
    );
    setNearbyPinLocations(nearbyPinLocationsResponse.payload);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentPositionAction()).then((position) => {
        setUserLocation(position);
        setMapPosition(position);
      });
    }, []),
  );

  useEffect(() => {
    if (region && mapReady && locationPermission) {
      setLoadingModalVisible(false);
    }
  }, [JSON.stringify(region), mapReady, locationPermission]);

  useFocusEffect(
    useCallback(() => {
      _loadServiceRequests();
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
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      throttleGetPinLocations(mapPosition?.latitude, mapPosition?.longitude);
    }, [JSON.stringify(mapPosition)]),
  );

  const _setMapPosition = (newPositionCordinates) => {
    if (
      userLocation &&
      newPositionCordinates.latitude.toFixed(5) !== userLocation.latitude.toFixed(5) &&
      newPositionCordinates.longitude.toFixed(5) !== userLocation.longitude.toFixed(5)
    ) {
      setMapPosition({ ...newPositionCordinates, latitudeDelta: 0.011, longitudeDelta: 0.011 });
    }
  };

  const _loadServiceRequests = () => {
    dispatch(getServiceRequestsAction());
  };

  const _sortServiceRequestDescending = (serviceRequest) => {
    return serviceRequest.sort((a, b) => moment(b.requestedDate) - moment(a.requestedDate));
  };

  const _handleOnServiceRequestCreatePress = async () => {
    if (Platform.OS === 'ios' || hasGmsSync()) await permissionsService.checkLocationPermissions();
    if (hasHmsSync()) {
      await permissionsService.requestHmsLocationPermissions();
    }
    navigation.navigate('SelectLocationScreen', {
      fromSubscribedChannels: false,
      showSRPins: true,
    });
  };

  const renderHiddenComponent = (account, channel) => (
    <TrashButton
      onPress={() => _handleDelete(account, channel)}
      iconSize={35}
      loading={isLoadingDeleteServiceRequest}
    />
  );

  const _handleDelete = (serviceRequest, channel) => {
    const channelId = _.get(channel, 'objectId', '');
    const serviceRequestId = _.get(serviceRequest, 'id', '');
    promptConfirm('Are you sure?', 'Are you sure you want to delete this item?', 'Delete', () => {
      dispatch(deleteServiceRequestAction(channelId, serviceRequestId));
    });
  };

  const handleFollowSR = (serviceRequestObjId, following) => () => {
    setIsLoadingFollowSR(true);
    serviceRequestService
      .followServiceRequest({
        userId: user.user_id,
        serviceRequestId: serviceRequestObjId,
        followed: following,
      })
      .then(() => {
        setSelectedSRPin({ ...selectedSRPin, following });
      })
      .finally(() => {
        setIsLoadingFollowSR(false);
      });
  };

  const renderServiceRequest = ({ item }) => {
    const deletable = _.get(item, 'status', '') === 'Completed';
    return (
      <SwipeRowContainer
        key={`${item.id}`}
        swipeKey={`${item.id}`}
        preview={deleteServiceRequestPreview && deletable}
        deletable={deletable}
        onPreviewEnd={() => {
          dispatch(previewDeleteServiceRequestAction(false));
        }}
        renderHiddenComponent={() => renderHiddenComponent(item)}
        renderVisibleComponent={() => (
          <ServiceRequestItem
            item={item}
            onPress={() => navigation.navigate('ViewServiceRequest', { serviceRequest: item })}
          />
        )}
      />
    );
  };

  const renderTabs = () => {
    return (
      <Tab
        value={tabIndex}
        onChange={(index) => {
          setTabIndex(index);
        }}
        indicatorStyle={[
          { backgroundColor: Colors.softBlue },
          Platform.select({ android: { borderWidth: 15 }, ios: {} }),
        ]}
      >
        <Tab.Item
          active={tabIndex === 0}
          titleStyle={[{ color: tabIndex === 0 ? Colors.black : Colors.gray }, styles.tabItem]}
          title="Map"
          icon={<Icon name="pin-drop" />}
        />

        <Tab.Item
          active={tabIndex === 0}
          titleStyle={[{ color: tabIndex === 1 ? Colors.black : Colors.gray }, styles.tabItem]}
          title="My List"
          icon={<Icon name="format-list-bulleted" />}
        />
      </Tab>
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
    return nearbyPinLocations?.map((pin) => {
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
          key={pin.id}
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
          coordinate={{ latitude: lng, longitude: lat }}
        >
          {renderHmsMarkerInfoWindow(pin)}
        </HMSMarker>
      ) : (
        <View />
      );
    });
  };

  const renderHmsMapPins = () => {
    return (
      <SafeAreaView style={[Layout.fill, ...[{ marginBottom: 200 }]]}>
        <View contentInsetAdjustmentBehavior="automatic">
          <HmsMapView
            style={[Layout.fullWidth, ...[{ height: '100%' }]]}
            mapType={MapTypes.NORMAL}
            camera={{
              target: userLocation || initialTarget,
              zoom: 15,
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
            onMapReady={() => setMapReady(true)}
            onCameraIdle={(event) => {
              _setMapPosition(event.nativeEvent.target);
            }}
          >
            {nearbyPinLocations?.length > 0 ? displayPins() : <></>}
          </HmsMapView>
        </View>
      </SafeAreaView>
    );
  };

  const renderMapViewPins = () => {
    return (
      <MapView
        style={[Layout.fill]}
        initialRegion={userLocation}
        showsUserLocation
        onPress={Keyboard.dismiss}
        onRegionChangeComplete={(newPosition) => {
          return _setMapPosition(newPosition);
        }}
        onMapReady={() => setMapReady(true)}
        zoomControlEnabled
        zoomEnabled
        showsMyLocationButton
      >
        {nearbyPinLocations.length > 0 ? displayPins() : <></>}
      </MapView>
    );
  };

  const renderServiceRequestList = () => {
    return (
      <>
        <ImageBackground
          source={Images.serviceRequest}
          style={[Layout.fullSize, Layout.fill]}
          resizeMode="cover"
        >
          <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Service Requests</Text>
          <FlatList
            contentContainerStyle={Gutters.smallHMargin}
            data={_sortServiceRequestDescending(serviceRequests)}
            renderItem={renderServiceRequest}
            keyExtractor={(item) => String(item.id)}
            refreshControl={
              <RefreshControl
                refreshing={isLoadingServiceRequests}
                onRefresh={_loadServiceRequests}
              />
            }
          />
        </ImageBackground>
        <FAB style={Common.fabAlignment} icon="plus" onPress={_handleOnServiceRequestCreatePress} />
      </>
    );
  };

  const renderFollowSRButon = () => {
    const { id, following, ownerId } = selectedSRPin;
    return (
      (user.user_id?.trim() !== ownerId?.trim() && (
        <Button
          mode="contained"
          style={[Gutters.tinyLMargin, ...[{ width: '40%' }], FontSize.small, Layout.alignSelfEnd]}
          color={Colors.primary}
          onPress={handleFollowSR(id, !following)}
          loading={isLoadingFollowSR}
          disabled={isLoadingFollowSR}
        >
          {following ? 'UnFollow' : 'Follow'}
        </Button>
      )) || <></>
    );
  };

  const renderHmsMarkerInfoWindow = (pin) => {
    const { id, serviceType, serviceDescription, requestDate, status } = pin;
    if (pin) {
      setSelectedSRPin(pin);
    }
    return (
      <HMSInfoWindow>
        <TouchableHighlight>
          <View style={Fonts.textRegular}>
            <View
              style={[
                ...[{ backgroundColor: Colors.lightgray, borderRadius: 10 }],
                Gutters.smallPadding,
              ]}
            >
              <Text style={[Gutters.smallVMargin, Fonts.textRegular, styles.headerFont]}>
                Type: {serviceType}
              </Text>
              <View style={styles.textLine} />
              <Text style={[Gutters.smallVMargin, Fonts.textRegular, styles.descriptionFont]}>
                Description:
              </Text>
              <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>{serviceDescription}</Text>
              <View style={styles.textLine} />
              <Text style={[Gutters.smallVMargin, Fonts.textRegular]}>Status: {status}</Text>
              <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>Date: {requestDate}</Text>
              <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>Reference No: {id}</Text>
              {renderFollowSRButon()}
            </View>
          </View>
        </TouchableHighlight>
      </HMSInfoWindow>
    );
  };

  const pinDetailsModal = () => {
    const { id, serviceType, serviceDescription, requestDate, status } = selectedSRPin;
    return (
      <Modal visible={pinsModalVisible} transparent>
        <TouchableOpacity
          style={[
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            ...[{ width: '100%', height: '100%', backgroundColor: Colors.transparent }],
          ]}
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

  return (
    <>
      {renderTabs()}
      {tabIndex === 1 ? (
        renderServiceRequestList()
      ) : (
        <>
          <View style={Layout.fullSize}>
            {hasGmsSync() || Platform.OS === 'ios' ? (
              renderMapViewPins()
            ) : hasHmsSync() ? (
              renderHmsMapPins()
            ) : (
              <View />
            )}
          </View>
          <View style={Common.pinContainer}>
            <Icon type="ionicon" name="pin-outline" size={30} color={Colors.primary} />
          </View>
          <FAB
            style={Common.fabAlignment}
            icon="plus"
            onPress={_handleOnServiceRequestCreatePress}
          />
          {pinDetailsModal()}
          <LoadingOverlay
            source={loadingImageSource}
            visible={loadingModalVisible}
            onBackDropPress={() => setLoadingModalVisible(false)}
          />
        </>
      )}
    </>
  );
};

ServiceRequestScreen.propTypes = {};

ServiceRequestScreen.defaultProps = {};

const styles = StyleSheet.create({
  descriptionFont: {
    fontSize: 16,
  },
  headerFont: {
    fontSize: 19,
  },
  modalView: {
    backgroundColor: Colors.black,
    borderRadius: 15,
    paddingLeft: 10,
  },
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    fontSize: 14,
  },
  textLine: {
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    width: 315,
  },
});

export default ServiceRequestScreen;
