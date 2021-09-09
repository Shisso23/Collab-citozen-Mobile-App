import React, { useEffect, useCallback } from 'react';
import { Button, List } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import {
  FlatList,
  Text,
  View,
  ImageBackground,
  Linking,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Platform,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { promptConfirm } from '../../../helpers/prompt.helper';
import { getChannelsContactsAction } from '../../../reducers/contacts-reducer/contacts.actions';
import {
  getAddressFromRegionAction,
  getCurrentPositionAction,
} from '../../../reducers/location-reducer/location.actions';
import { channelContactsSelector } from '../../../reducers/contacts-reducer/contacts.reducer';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';

const ContactDetailsScreen = () => {
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();

  const dispatch = useDispatch();
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

  const onCall = (item) => {
    Linking.openURL(`tel://${item.number}`)
      .then((supported) => {
        if (!supported) {
          return Alert.alert('Phone number is not available');
        }
        return Linking.openURL(item.number);
      })
      .catch((error) => error);
  };

  const renderContactDetails = ({ item }) => {
    return (
      <View style={Gutters.smallBMargin}>
        <Text style={[Gutters.smallVMargin, Gutters.regularBMargin, styles.channel]}>
          {item.name}
        </Text>
        {item.contacts.map((contact) => (
          <View key={contact.objId} style={[Common.textInputWithShadow, styles.contactItem]}>
            <List.Item
              title={contact.name}
              titleStyle={[Common.cardTitle]}
              onPress={() =>
                Platform.OS === 'ios'
                  ? onCall(contact)
                  : promptConfirm(`Contact ${contact.name} ?`, '', 'Call', () => onCall(contact))
              }
              description={() => (
                <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                  <Icon
                    name="phone"
                    type="font-awesome"
                    color={Colors.primary}
                    style={Gutters.smallRMargin}
                  />
                  <Text
                    style={[Fonts.textRegular, Common.cardDescription, { color: Colors.darkgray }]}
                  >
                    {contact.number}
                  </Text>
                </View>
              )}
              right={() => (
                <Button mode="contained" style={[Layout.alignItemsCenter, Layout.alignSelfCenter]}>
                  Call
                </Button>
              )}
            />
          </View>
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
  contactItem: { margin: 8 },
  locationLabel: { color: Colors.gray, fontSize: 12 },
});

export default ContactDetailsScreen;
