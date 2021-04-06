import React, { useEffect } from 'react';
import { Avatar, FAB, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import { getServiceRequestsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { municipalitiesSelector } from '../../../reducers/municipalities-reducer/municipalities.reducer';
import { flashService } from '../../../services';

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { serviceRequests, isLoadingServiceRequests } = useSelector(serviceRequestSelector);
  const { accounts } = useSelector(accountsSelector);
  const { municipalities } = useSelector(municipalitiesSelector);
  const { Common, Gutters, Fonts, Layout, Colors } = useTheme();

  const _loadServiceRequests = () => {
    dispatch(getServiceRequestsAction());
  };

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
    return _.isEmpty(item.serviceRequestImage) ? { uri: item.avatarUrl } : item.serviceRequestImage;
  };
  useEffect(() => {
    _loadServiceRequests();
  }, []);

  const _handleOnServiceRequestCreatePress = () => {
    if (accounts.length === 0) {
      flashService.error('No Properties linked to account.');
    } else if (municipalities.length === 0) {
      flashService.error('No municipalities linked to account.');
    } else {
      navigation.push('CreateServiceRequest');
    }
  };

  const serviceRequestItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.serviceType}
          description={
            <View style={[Layout.column]}>
              <Text>{item.gpsAddress}</Text>
              <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                <View
                  style={[
                    Gutters.tinyHMargin,
                    styles.statusIndicator,
                    { backgroundColor: _getStatusIndicator(item.status) },
                  ]}
                />
                <Text style={[Fonts.textRegular]}>{item.status}</Text>
              </View>
            </View>
          }
          onPress={() => {
            navigation.push('ViewServiceRequest', { serviceRequest: item });
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
          descriptionNumberOfLines={4}
        />
      </View>
    );
  };
  return (
    <>
      <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Service Requests</Text>
      <FlatList
        contentContainerStyle={[Gutters.smallHMargin]}
        data={_sortServiceRequestDescending(serviceRequests)}
        renderItem={serviceRequestItem}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoadingServiceRequests}
        onRefresh={_loadServiceRequests}
      />

      <FAB style={[Common.fabAlignment]} icon="plus" onPress={_handleOnServiceRequestCreatePress} />
    </>
  );
};

ServiceRequestScreen.propTypes = {};

ServiceRequestScreen.defaultProps = {};
const styles = StyleSheet.create({
  statusIndicator: {
    borderRadius: 5,
    height: 7,
    width: 7,
  },
});
export default ServiceRequestScreen;
