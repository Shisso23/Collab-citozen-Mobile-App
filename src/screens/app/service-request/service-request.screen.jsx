import React, { useCallback, useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
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
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';

const { Colors } = useTheme();

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    serviceRequests,
    isLoadingServiceRequests,
    isLoadingDeleteServiceRequest,
    deleteServiceRequestPreview,
  } = useSelector(serviceRequestSelector);
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();
  const [mapNotSelected, setMapNotSelected] = useState(0);
  const { region } = useSelector(locationSelector);
  const [regionChange, setRegionChange] = useState({
    ...region,
    latitudeDelta: 0.011,
    longitudeDelta: 0.011,
  });
  const [mapReady, setMapReady] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [nearbyLocationsReceived, setNearbyLocationsReceived] = useState(false);
  const [nearbyPinLocations, setNearbyPinLocations] = useState([]);
  const [displayPinReferenceNumber, setDisplayPinReferenceNumber] = useState('');
  const [displayPinType, setDisplayPinType] = useState('');
  const [displayPinDescription, setDisplayPinDescription] = useState('');
  const [displayPinRequestDate, setDisplayPinRequestDate] = useState('');
  const [displayPinStatus, setDisplayPinStatus] = useState('');
  let nearbyPinLocationsResponse = [];

  const removeLocationAndListener = (code) => {
    HMSLocation.FusedLocation.Native.removeLocationUpdates(code)
      .then((res) => res)
      .catch((err) => console.log(err.message));
    HMSLocation.FusedLocation.Events.removeFusedLocationEventListener((removedResponse) => {
      return removedResponse;
    });
  };

  const getNearbyPinLocations = async (currentLatitude, currentLongitude) => {
    nearbyPinLocationsResponse = await dispatch(
      getNearbyPinLocationsAction(currentLatitude, currentLongitude),
    );
    setNearbyPinLocations(nearbyPinLocationsResponse);
    if (nearbyPinLocationsResponse.payload.length > 0) {
      setNearbyLocationsReceived(true);
    }
  };

  useEffect(() => {
    if (hasHmsSync()) {
      HMSLocation.LocationKit.Native.init()
        .then((resp) => resp)
        .catch((err) => console.log(err.message));
    }
    return () => {
      if (hasHmsSync()) {
        removeLocationAndListener(1);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getNearbyPinLocations(regionChange.latitude, regionChange.longitude);
    }, [regionChange]),
  );

  const _setRegion = async (newRegion) => {
    if (
      newRegion.latitude.toFixed(5) !== region.latitude.toFixed(5) &&
      newRegion.longitude.toFixed(5) !== region.latitude.toFixed(5)
    ) {
      setRegionChange(newRegion);
    }
  };

  const _loadServiceRequests = () => {
    dispatch(getServiceRequestsAction());
  };

  useEffect(() => {
    _loadServiceRequests();
    dispatch(getCurrentPositionAction());
  }, []);

  const _sortServiceRequestDescending = (serviceRequest) => {
    return serviceRequest.sort((a, b) => moment(b.requestedDate) - moment(a.requestedDate));
  };

  const _handleOnServiceRequestCreatePress = async () => {
    if (Platform.OS === 'ios' || hasGmsSync()) await permissionsService.checkLocationPermissions();
    if (hasHmsSync()) {
      permissionsService.requestHmsLocationPermissions();
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

  const displayPins = (pinData) => {
    if (mapReady && nearbyLocationsReceived) {
      let i = 0;
      return pinData.payload.map((pin) => {
        i += 1;

        const pinReferenceNumber = pin.id;
        const pinType = pin.serviceType;
        const pinDescription = pin.serviceDescription;
        const pinRequestDate = pin.requestDate;
        const pinStatus = pin.status;

        const { gpsCoordinates } = pin;
        const gpsCoordinatesSubString0 = gpsCoordinates.substring(5);
        const gpsCoordinatesSubString1 = gpsCoordinatesSubString0.substring(
          1,
          gpsCoordinatesSubString0.length - 1,
        );

        const gpsCoordinatesSubString2 = gpsCoordinatesSubString1;
        const gpsCoordinatesSubString3 = gpsCoordinatesSubString2.split(' ');

        const lat = parseFloat(gpsCoordinatesSubString3[0]);
        const lng = parseFloat(gpsCoordinatesSubString3[1]);

        if (pin.status === 'Assigned') {
          return (
            <Marker
              coordinate={{ latitude: lng, longitude: lat }}
              onPress={() =>
                displayModalToggle(
                  pinReferenceNumber,
                  pinType,
                  pinDescription,
                  pinRequestDate,
                  pinStatus,
                )
              }
              key={i}
            >
              <View style={styles.pin}>
                <Icon name="location-pin" size={45} color={Colors.lightGreen} />
              </View>
            </Marker>
          );
        }
        if (pin.status === 'Registered') {
          return (
            <Marker
              coordinate={{ latitude: lng, longitude: lat }}
              onPress={() =>
                displayModalToggle(
                  pinReferenceNumber,
                  pinType,
                  pinDescription,
                  pinRequestDate,
                  pinStatus,
                )
              }
              key={i}
            >
              <View style={styles.pin}>
                <Icon name="location-pin" size={45} color={Colors.lightBlue} />
              </View>
            </Marker>
          );
        }
        return (
          <Marker
            coordinate={{ latitude: lng, longitude: lat }}
            onPress={() =>
              displayModalToggle(
                pinReferenceNumber,
                pinType,
                pinDescription,
                pinRequestDate,
                pinStatus,
              )
            }
            key={i}
          >
            <View style={styles.pin}>
              <Icon name="location-pin" size={45} color={Colors.lightOrange} />
            </View>
          </Marker>
        );
      });
    }
    return null;
  };

  const displayModalToggle = (refNum, type, desc, date, status) => {
    setDisplayModal(!displayModal);
    if (!displayModal) {
      setDisplayPinReferenceNumber(refNum);
      setDisplayPinType(type);
      setDisplayPinDescription(desc);
      setDisplayPinRequestDate(date);
      setDisplayPinStatus(status);
    }
  };

  return (
    <>
      <Tab
        value={mapNotSelected}
        onChange={(index) => {
          setMapNotSelected(index);
        }}
        indicatorStyle={[
          { backgroundColor: Colors.softBlue },
          Platform.select({ android: { borderWidth: 15 }, ios: {} }),
        ]}
      >
        <Tab.Item
          titleStyle={[
            { color: mapNotSelected === 0 ? Colors.black : Colors.gray },
            styles.tabItem,
          ]}
          title="Map"
          icon={<Icon name="pin-drop" />}
        />

        <Tab.Item
          titleStyle={[
            { color: mapNotSelected === 1 ? Colors.black : Colors.gray },
            styles.tabItem,
          ]}
          title="My List"
          icon={<Icon name="format-list-bulleted" />}
        />
      </Tab>

      {mapNotSelected ? (
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
          <FAB
            style={Common.fabAlignment}
            icon="plus"
            onPress={_handleOnServiceRequestCreatePress}
          />
        </>
      ) : region && nearbyLocationsReceived ? (
        <>
          <View style={Layout.fullSize}>
            <MapView
              style={Layout.fill}
              initialRegion={region}
              showsUserLocation
              onMapReady={() => setMapReady(true)}
              onPress={Keyboard.dismiss}
              onRegionChangeComplete={(newRegion) => {
                return _setRegion(newRegion);
              }}
              showsMyLocationButton={false}
              zoomControlEnabled
            >
              {displayPins(nearbyPinLocations)}
            </MapView>
          </View>
          <View style={Common.pinContainer}>
            <Icon type="ionicon" name="pin-outline" size={30} color={Colors.primary} />
          </View>
          <FAB
            style={Common.fabAlignment}
            icon="plus"
            onPress={_handleOnServiceRequestCreatePress}
          />
          <Modal visible={displayModal} onDismiss={() => {}} transparent>
            <View
              style={[styles.modal, { backgroundColor: Colors.transparent }, Fonts.textRegular]}
            >
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
                <Text style={[Gutters.smallBMargin, Fonts.textRegular]}>
                  {displayPinDescription}
                </Text>
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
        </>
      ) : region ? (
        <>
          <View style={Layout.fullSize}>
            <MapView
              style={Layout.fill}
              initialRegion={region}
              showsUserLocation
              onMapReady={() => setMapReady(true)}
              onPress={Keyboard.dismiss}
              onRegionChangeComplete={(newRegion) => {
                return _setRegion(newRegion);
              }}
              showsMyLocationButton={false}
              zoomControlEnabled
            />
          </View>
          <FAB
            style={Common.fabAlignment}
            icon="plus"
            onPress={_handleOnServiceRequestCreatePress}
          />
        </>
      ) : (
        <></>
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
