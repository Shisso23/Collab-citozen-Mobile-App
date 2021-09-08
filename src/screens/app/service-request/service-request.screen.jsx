import _ from 'lodash';
import React from 'react';
import { Avatar, FAB, List } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Text, View, RefreshControl, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';

import useTheme from '../../../theme/hooks/useTheme';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import { getServiceRequestsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import { permissionsService } from '../../../services';

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { serviceRequests, isLoadingServiceRequests } = useSelector(serviceRequestSelector);
  const { Common, Gutters, Fonts, Layout, Colors, Images } = useTheme();

  const _loadServiceRequests = () => {
    dispatch(getServiceRequestsAction());
  };

  useFocusEffect(
    React.useCallback(() => {
      _loadServiceRequests();
    }, []),
  );

  const _sortServiceRequestDescending = (serviceRequest) => {
    return serviceRequest.sort((a, b) => moment(b.requestedDate) - moment(a.requestedDate));
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
        return Colors.error;
    }
  };

  const _setImageUrl = (item) => {
    return !item.serviceRequestImage ? null : item.serviceRequestImage[0];
  };

  const _handleOnServiceRequestCreatePress = async () => {
    await permissionsService.checkLocationPermissions();
    navigation.navigate('SelectLocationScreen', false);
  };

  const serviceRequestItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.serviceType}
          titleStyle={Common.cardTitle}
          description={() => (
            <View style={[Layout.column, Gutters.largeRMargin]}>
              <Text style={Common.cardDescription}>{item.gpsAddress}</Text>
              <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                <View
                  style={[
                    Gutters.tinyHMargin,
                    Common.statusIndicator,
                    { backgroundColor: _getStatusIndicator(item.status) },
                  ]}
                />
                <Text style={[Fonts.textRegular, Common.cardDescription]}>{item.status}</Text>
              </View>
            </View>
          )}
          onPress={() => {
            navigation.navigate('ViewServiceRequest', { serviceRequest: item });
          }}
          left={() => (
            <View style={[Layout.justifyContentCenter]}>
              <Avatar.Image rounded size={50} source={_setImageUrl(item)} />
            </View>
          )}
          right={() => (
            <View style={[Layout.rowVCenter]}>
              {!_.isEmpty(item.serviceRequestImage) ? null : (
                <Icon
                  color={Colors.red}
                  size={20}
                  name="camera"
                  style={[Layout.alignSelfCenter, Gutters.smallHMargin]}
                />
              )}
              <Icon name="ellipsis-v" style={[Layout.alignSelfCenter]} />
            </View>
          )}
          descriptionNumberOfLines={10}
          descriptionStyle={[Gutters.largeRMargin]}
        />
      </View>
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
          renderItem={serviceRequestItem}
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
