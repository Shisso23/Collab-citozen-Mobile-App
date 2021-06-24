/* eslint-disable */
import _ from 'lodash';
import React, { useEffect } from 'react';
import { Avatar, FAB, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Text, View, RefreshControl, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';

import useTheme from '../../../theme/hooks/useTheme';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import { getServiceRequestsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import { permissionsService } from '../../../services';

const ViewSubscribeToChannelsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { serviceRequests, isLoadingServiceRequests } = useSelector(serviceRequestSelector);
  const { Common, Gutters, Fonts, Layout, Colors, Images } = useTheme();

  const _loadServiceRequests = () => {
    dispatch(getServiceRequestsAction()); // getSubscribedToChannels
  };

  const _getStatusIndicator = (status) => {
    switch (status) {
      case 'Registered':
        return Colors.softBlue;
      case 'Assigned':
        return Colors.primary;
      case 'Work in Progress':
        return Colors.warning;
      default:
        return Colors.primary;
    }
  };

  useEffect(() => {
    _loadServiceRequests();
  }, []);

  const _handleOnSubscribeToChannelsPress = async () => {
    await permissionsService.checkLocationPermissions();
    navigation.navigate('SelectLocationScreen', true);
  };

  const newsFeedDummyObject = {
    dummyId: 1,
    title: 'Buffalo City (East London)',
    status: true,
  };

  const newsFeedDummyObject2 = {
    dummyId: 2,
    title: 'City of Cape Town',
    subscribed: true,
  };

  const dummyarray = [];
  dummyarray.push(newsFeedDummyObject);
  dummyarray.push(newsFeedDummyObject2);

  const viewSubscribedToChannelsItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.title}
          // right={() => (
          //   <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
          //     <View
          //       style={[
          //         Gutters.tinyHMargin,
          //         Common.statusIndicator,
          //         { backgroundColor: _getStatusIndicator(item.status) },
          //       ]}
          //     />
          //   </View>
          // )}
        />
      </View>
    );
  };

  return (
    <>
      <ImageBackground source={Images.serviceRequest} style={[Layout.fullSize]} resizeMode="cover">
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>My Channels</Text>
        <FlatList
          contentContainerStyle={[Gutters.smallHMargin]}
          data={dummyarray}
          renderItem={viewSubscribedToChannelsItem}
          keyExtractor={(item) => String(item.dummyId)}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={isLoadingServiceRequests}
          //     onRefresh={_loadServiceRequests}
          //     tintColor={Colors.primary}
          //     colors={[Colors.primary]}
          //   />
          // }
        />
      </ImageBackground>

      <FAB style={[Common.fabAlignment]} icon="plus" onPress={_handleOnSubscribeToChannelsPress} />
    </>
  );
};

ViewSubscribeToChannelsScreen.propTypes = {};

ViewSubscribeToChannelsScreen.defaultProps = {};

export default ViewSubscribeToChannelsScreen;
