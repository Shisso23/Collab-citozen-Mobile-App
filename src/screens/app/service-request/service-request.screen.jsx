import React, { useEffect } from 'react';
import { Avatar, FAB, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import useTheme from '../../../theme/hooks/useTheme';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import { getServiceRequestsAction } from '../../../reducers/service-request-reducer/service-request.actions';

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { serviceRequests, isLoadingServiceRequests } = useSelector(serviceRequestSelector);
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

  useEffect(() => {
    _loadServiceRequests();
  }, []);

  const serviceRequestItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.serviceType}
          description={
            <View style={[Layout.column]}>
              <Text>{item.address}</Text>
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
          left={() => <Avatar.Image rounded size={50} source={{ uri: item.avatarUrl }} />}
          right={() => <Icon name="ellipsis-v" style={[Layout.alignSelfCenter]} />}
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

      <FAB
        style={[Common.fabAlignment]}
        icon="plus"
        onPress={() => navigation.push('CreateServiceRequest')}
      />
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
