import React, { useEffect } from 'react';
import { Avatar, FAB, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../../../theme/hooks/useTheme';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import { getServiceRequestsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ServiceRequestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { serviceRequests, isLoadingServiceRequests } = useSelector(serviceRequestSelector);
  const { Common, Gutters, Fonts, Layout } = useTheme();

  const _loadServiceRequests = () => {
    dispatch(getServiceRequestsAction());
  };

  useEffect(() => {
    _loadServiceRequests();
  }, []);

  const serviceRequestItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.serviceType}
          description={item.address}
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
        data={serviceRequests}
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

export default ServiceRequestScreen;
