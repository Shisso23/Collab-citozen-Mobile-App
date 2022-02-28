import React, { useEffect, useCallback, useState } from 'react';
import { List } from 'react-native-paper';
import {
  FlatList,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { getChannelsContactsAction } from '../../../reducers/contacts-reducer/contacts.actions';
import {
  getAddressFromRegionAction,
  getCurrentPositionAction,
} from '../../../reducers/location-reducer/location.actions';
import { channelContactsSelector } from '../../../reducers/contacts-reducer/contacts.reducer';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';
import ContactButtons from '../../../components/molecules/contact-buttons';

const ContactDetailsScreen = () => {
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [collapsedIndex, setCollapedIndex] = useState(null);
  const navigation = useNavigation();
  const { channelsContacts, isLoadingChannelsContacts } = useSelector(channelContactsSelector);
  const { selectedAddress, region } = useSelector(locationSelector);

  useEffect(() => {
    dispatch(getCurrentPositionAction());
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (region) {
        getAddress(region);
        getContacts(region);
      }
    }, [region]),
  );

  const onBack = () => {
    navigation.navigate('ContactDetails');
  };

  const handlePickLocation = () => {
    return navigation.navigate('ContactDetails');
  };

  const getAddress = async (coords) => {
    const addressFromCoords = await dispatch(getAddressFromRegionAction(coords));
    return addressFromCoords;
  };

  const getContacts = async (currentRegion) => {
    return dispatch(getChannelsContactsAction(currentRegion));
  };

  const handleCollapse = (index) => () => {
    setCollapedIndex(index);
    setIsCollapsed(!isCollapsed);
  };

  const renderContactDetails = ({ item }) => {
    return (
      <View style={Gutters.smallBMargin}>
        <Text style={[Gutters.smallVMargin, Gutters.regularBMargin, styles.channel]}>
          {item.name}
        </Text>
        {item.contacts.map((contact, index) => (
          <List.Accordion
            key={contact.name || index}
            title={contact.name}
            titleStyle={[Common.cardTitle]}
            style={[
              Gutters.smallVMargin,
              // eslint-disable-next-line react-native/no-inline-styles
              { borderBottomWidth: !isCollapsed && collapsedIndex === index ? 0 : 0.3 },
            ]}
            onPress={handleCollapse(index)}
          >
            <ContactButtons contact={contact} />
          </List.Accordion>
        ))}
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
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Contact details</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SelectLocationScreen', {
              onBack,
              handlePickLocation,
            });
          }}
          activeOpacity={1}
          style={[
            Gutters.tinyLPadding,
            Gutters.smallHMargin,
            Gutters.smallPadding,
            Gutters.smallBMargin,
            { backgroundColor: Colors.shadow },
          ]}
        >
          <Text style={[Gutters.smallLPadding, Gutters.tinyBMargin, styles.locationLabel]}>
            Location selected
          </Text>
          <View style={[Layout.rowBetween, Layout.alignItemsCenter]}>
            <Text style={[Gutters.smallLPadding, styles.address]}>{selectedAddress}</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={channelsContacts}
          renderItem={renderContactDetails}
          keyExtractor={(item) => String(item.number)}
          refreshing={isLoadingChannelsContacts}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingChannelsContacts}
              onRefresh={() => getContacts(region)}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  address: { fontSize: 15 },
  channel: { fontSize: 16, fontWeight: '500' },
  locationLabel: { color: Colors.gray, fontSize: 12 },
});

export default ContactDetailsScreen;
