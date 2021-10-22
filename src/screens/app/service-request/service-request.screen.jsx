import React from 'react';
import { FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Text, RefreshControl, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import {
  deleteServiceRequestAction,
  getServiceRequestsAction,
  previewDeleteServiceRequestAction,
} from '../../../reducers/service-request-reducer/service-request.actions';
import { permissionsService } from '../../../services';
import { getCurrentPositionAction } from '../../../reducers/location-reducer/location.actions';
import ServiceRequestItem from '../../../components/molecules/service-request-item';
import SwipeRowContainer from '../../../components/atoms/swipe-row/swipe-row';
import { promptConfirm } from '../../../helpers/prompt.helper';
import { TrashButton } from '../../../components/atoms';

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    serviceRequests,
    isLoadingServiceRequests,
    isLoadingDeleteServiceRequest,
    deleteServiceRequestPreview,
  } = useSelector(serviceRequestSelector);
  const { Common, Gutters, Fonts, Layout, Colors, Images } = useTheme();

  const _loadServiceRequests = () => {
    dispatch(getServiceRequestsAction());
  };

  useFocusEffect(
    React.useCallback(() => {
      _loadServiceRequests();
      return () => {
        dispatch(getCurrentPositionAction());
      };
    }, []),
  );

  const _sortServiceRequestDescending = (serviceRequest) => {
    return serviceRequest.sort((a, b) => moment(b.requestedDate) - moment(a.requestedDate));
  };

  const _handleOnServiceRequestCreatePress = async () => {
    await permissionsService.checkLocationPermissions();
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

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Service Requests</Text>
        <FlatList
          contentContainerStyle={[Gutters.smallHMargin]}
          data={_sortServiceRequestDescending(serviceRequests)}
          renderItem={renderServiceRequest}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingServiceRequests}
              onRefresh={_loadServiceRequests}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      </ImageBackground>

      <FAB style={[Common.fabAlignment]} icon="plus" onPress={_handleOnServiceRequestCreatePress} />
    </>
  );
};

ServiceRequestScreen.propTypes = {};

ServiceRequestScreen.defaultProps = {};

export default ServiceRequestScreen;
