import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import HmsMapView, {
  HMSMarker,
  MapTypes,
  MarkerAnimation,
  Hue,
} from '@hmscore/react-native-hms-map';
import HMSLocation from '@hmscore/react-native-hms-location';
import { FAB, Modal } from 'react-native-paper';
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
import { permissionsService } from '../../../services';
import { getCurrentPositionAction } from '../../../reducers/location-reducer/location.actions';
import ServiceRequestItem from '../../../components/molecules/service-request-item';
import SwipeRowContainer from '../../../components/atoms/swipe-row/swipe-row';
import { promptConfirm } from '../../../helpers/prompt.helper';
import { TrashButton } from '../../../components/atoms';
import {
  locationSelector,
  setRegionAction,
} from '../../../reducers/location-reducer/location.reducer';

const { Colors } = useTheme();

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [hmsMapRef, setHmsMapRef] = useState(undefined);
  const {
    serviceRequests,
    isLoadingServiceRequests,
    isLoadingDeleteServiceRequest,
    deleteServiceRequestPreview,
  } = useSelector(serviceRequestSelector);
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const { region } = useSelector(locationSelector);

  const [mapReady, setMapReady] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [nearbyLocationsReceived, setNearbyLocationsReceived] = useState(false);
  const [nearbyPinLocations, setNearbyPinLocations] = useState([]);
  const [displayPinReferenceNumber, setDisplayPinReferenceNumber] = useState('');
  const [displayPinType, setDisplayPinType] = useState('');
  const [displayPinDescription, setDisplayPinDescription] = useState('');
  const [displayPinRequestDate, setDisplayPinRequestDate] = useState('');
  const [displayPinStatus, setDisplayPinStatus] = useState('');
  const [shouldCameraUpdate, setShouldCameraUpdate] = useState(true);
  // let [nearbyPinLocationsResponse, setNearByPinLocations] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(9);
  const debounceSetRegion = useMemo(
    () =>
      _.throttle(
        (event, region_) => {
          return _setRegion(event.nativeEvent.target, region_);
        },
        2000,
        undefined,
      ),
    [],
  );

  const stopAnimationDevouce = useMemo(
    () =>
      _.throttle(
        (event) => {
          hmsMapRef.stopAnimation();
          setShouldCameraUpdate(false);
        },
        2000,
        undefined,
      ),
    [],
  );

  const removeLocationAndListener = (code) => {
    HMSLocation.FusedLocation.Native.removeLocationUpdates(code)
      .then((res) => res)
      .catch((err) => console.log(err.message));
    HMSLocation.FusedLocation.Events.removeFusedLocationEventListener((removedResponse) => {
      return removedResponse;
    });
  };

  const getNearbyPinLocations = async (currentLatitude, currentLongitude) => {
    const nearbyPinLocationsResponse = await dispatch(
      getNearbyPinLocationsAction(currentLatitude, currentLongitude),
    );
    console.log({ nearbyPinLocationsResponse: nearbyPinLocationsResponse.payload[0] });
    setNearbyPinLocations(nearbyPinLocationsResponse);
    if (nearbyPinLocationsResponse.payload.length > 0) {
      setNearbyLocationsReceived(true);
    }
  };

  useEffect(() => {
    _loadServiceRequests();
    // dispatch(getCurrentPositionAction()).then(()=>{});
    if (hasHmsSync()) {
      HMSLocation.LocationKit.Native.init()
        .then((resp) => resp)
        .catch((err) => console.warn(err.message));
    }
    return () => {
      if (hasHmsSync()) {
        removeLocationAndListener(1);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getNearbyPinLocations(region?.latitude, region?.longitude);
    }, [JSON.stringify(region)]),
  );

  const _setRegion = useCallback(
    (newRegion, region_) => {
      if (
        region_ &&
        newRegion.latitude.toFixed(5) !== region_.latitude.toFixed(5) &&
        newRegion.longitude.toFixed(5) !== region_.longitude.toFixed(5)
      ) {
        console.log('Updating');
        dispatch(setRegionAction({ ...newRegion, latitudeDelta: 0.011, longitudeDelta: 0.011 }));
      }
    },
    [JSON.stringify(region)],
  );

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
    navigation.navigate('SelectLocationScreen', { fromSubscribedChannels: false });
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
        return hasHmsSync() ? Hue.ORANGE : Colors.lightOrange;
      case 'Registered':
        return hasHmsSync() ? Hue.CYAN : Colors.lightBlue;
      case 'Completed':
        return hasHmsSync() ? Hue.BLUE : Colors.primary;
      case 'Assigned':
        return hasHmsSync() ? Hue.GREEN : Colors.lightGreen;
      default:
        return hasHmsSync() ? Hue.VIOLET : Colors.gray;
    }
  };

  const displayPins = (pinData) => {
    if (nearbyLocationsReceived) {
      let i = 0;
      return pinData.payload.map((pin) => {
        i += 1;
        const { gpsCoordinates } = pin;
        const cordinates = gpsCoordinates
          .substring(gpsCoordinates.indexOf('(') + 1, gpsCoordinates.indexOf(')'))
          .split(' ');
        const lat = parseFloat(cordinates[0]);
        const lng = parseFloat(cordinates[1]);

        return hasHmsSync() ? (
          <HMSMarker
            key={pin.id}
            icon={{ hue: returnMarkerColour(pin.status) }}
            title={pin.serviceDescription}
            clusterable
            coordinate={{ latitude: lng, longitude: lat }}
          />
        ) : (
          <Marker
            coordinate={{ latitude: lng, longitude: lat }}
            onPress={() => displayModalToggle(pin)}
            key={i}
          >
            <View style={styles.pin}>
              <Icon name="location-pin" size={45} color={returnMarkerColour(pin.status)} />
            </View>
          </Marker>
        );
      });
    }
    return null;
  };

  const renderHmsMapPins = (region_) => {
    return (
      <View style={[Layout.fill, ...[{ marginBottom: 200 }]]}>
        <HmsMapView
          ref={(e) => {
            setHmsMapRef(e);
          }}
          style={[Layout.fullWidth, ...[{ height: '100%' }]]}
          mapType={MapTypes.NORMAL}
          camera={{
            target: { ...region, latitudeDelta: 0.011, longitudeDelta: 0.011 },
            zoom: zoomLevel,
          }}
          onTouchEnd={() => {
            setTimeout(() => {
              setShouldCameraUpdate(false);
              console.log('touch end');
              hmsMapRef.stopAnimation();
            }, 2000);
          }}
          onTouchStart={() => {
            console.log('Touch start');
            setShouldCameraUpdate(true);
          }}
          zoomControlsEnabled
          onCameraIdle={(event) => {
            if (shouldCameraUpdate) {
              console.log('should update');
              setZoomLevel(event.nativeEvent.zoom);
              event.persist();
              debounceSetRegion(event, region_);
            }
          }}
          zoomGesturesEnabled
          myLocationButtonEnabled
          myLocationEnabled
          useAnimation
        >
          {nearbyLocationsReceived ? displayPins(nearbyPinLocations) : <></>}
        </HmsMapView>
      </View>
    );
  };

  const renderMapViewPins = (region_) => {
    return (
      <MapView
        style={Layout.fill}
        initialRegion={region}
        showsUserLocation
        onMapReady={() => setMapReady(true)}
        onPress={Keyboard.dismiss}
        onRegionChangeComplete={(newRegion) => {
          return _setRegion(newRegion, region_);
        }}
        showsMyLocationButton={false}
        zoomControlEnabled
      >
        {nearbyLocationsReceived ? displayPins(nearbyPinLocations) : <></>}
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

  const pinDetailsModal = () => {
    return (
      <Modal visible={displayModal} onDismiss={() => {}} transparent>
        <View style={[styles.modal, { backgroundColor: Colors.transparent }, Fonts.textRegular]}>
          <TouchableOpacity onPress={displayModalToggle}>
            <Icon name="close" size={30} color={Colors.lightgray} />
          </TouchableOpacity>

          <View style={[styles.modalView, { backgroundColor: Colors.lightgray }]}>
            <Text style={[Gutters.smallVMargin, Fonts.textRegular, styles.headerFont]}>
              Type: {displayPinType}
            </Text>
            <View style={styles.textLine} />
            <Text style={[Gutters.smallVMargin, Fonts.textRegular, styles.descriptionFont]}>
              Description:
            </Text>
            <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>{displayPinDescription}</Text>
            <View style={styles.textLine} />
            <Text style={[Gutters.smallVMargin, Fonts.textRegular]}>
              Status: {displayPinStatus}
            </Text>
            <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>
              Date: {displayPinRequestDate}
            </Text>
            <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>
              Reference No: {displayPinReferenceNumber}
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  const displayModalToggle = (pin) => {
    const { id, serviceType, serviceDescription, requestDate, status } = pin;
    setDisplayModal(!displayModal);
    if (!displayModal) {
      setDisplayPinReferenceNumber(id);
      setDisplayPinType(serviceType);
      setDisplayPinDescription(serviceDescription);
      setDisplayPinRequestDate(requestDate);
      setDisplayPinStatus(status);
    }
  };

  return (
    <>
      {renderTabs()}
      {tabIndex === 1 ? (
        renderServiceRequestList()
      ) : (
        <>
          <View style={Layout.fullSize}>
            {hasHmsSync() ? renderHmsMapPins(region) : renderMapViewPins(region)}
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
  modal: {
    alignItems: 'flex-end',
    borderRadius: 20,
    flex: 0,
    justifyContent: 'center',
    marginRight: 40,
  },
  modalView: {
    alignItems: 'flex-start',
    backgroundColor: Colors.black,
    borderRadius: 15,
    flex: 0,
    height: '70%',
    justifyContent: 'center',
    paddingLeft: 10,
    width: '90%',
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
