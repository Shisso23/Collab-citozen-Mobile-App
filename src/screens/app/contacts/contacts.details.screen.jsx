import React, { useEffect, useState } from 'react';
import { List } from 'react-native-paper';
import { Icon, Divider } from 'react-native-elements';
import {
  FlatList,
  Text,
  View,
  ImageBackground,
  Linking,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { promptConfirm } from '../../../helpers/prompt.helper';
import { getChannelsContactsAction } from '../../../reducers/contacts-reducer/contacts.actions';
import { getAddressFromRegionAction } from '../../../reducers/location-reducer/location.actions';
import { channelContactsSelector } from '../../../reducers/contacts-reducer/contacts.reducer';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';
import { flashService } from '../../../services';

const ContactDetailsScreen = () => {
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentLocationCordinates, setCurrentLocationCordinates] = useState({
    latitude: -34.224471,
    longitude: 19.434491,
    latitudeDelta: 0.011,
    longitudeDelta: 0.011,
  });

  const { channelsContacts } = useSelector(channelContactsSelector);
  const { selectedAddress } = useSelector(locationSelector);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocationCordinates({
          ...currentLocationCordinates,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        flashService.error('Failed to get current location');
      },
      { timeout: 600, maximumAge: 0, enableHightAccuracy: true },
    );
  };

  useEffect(() => {
    getContacts();
    getCurrentLocation();
    getAddress(currentLocationCordinates);
  }, []);

  const getAddress = async (coords) => {
    const addressFromCoords = await dispatch(getAddressFromRegionAction(coords));
    return addressFromCoords;
  };

  const getContacts = async () => {
    return dispatch(getChannelsContactsAction(currentLocationCordinates));
  };

  useEffect(() => {
    dispatch(getChannelsContactsAction(currentLocationCordinates));
    getContacts();
    getAddress(currentLocationCordinates);
  }, [currentLocationCordinates.latitude]);

  const onCall = (item) => {
    Linking.openURL(`tel://${item.number}`)
      .then((supported) => {
        if (!supported) {
          return Alert.alert('Phone number is not available');
        }
        return Linking.openURL(item.number);
      })
      .catch((error) => console.warn(_.get(error, 'message', 'Failed to open!')));
  };

  const renderContactDetails = ({ item }) => {
    return (
      <View style={Gutters.smallBMargin}>
        <Text style={Gutters.smallVMargin}>{item.name}</Text>
        {item.contacts.map((contact) => (
          <View key={contact.objId} style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
            <List.Item
              title={contact.name}
              titleStyle={[Common.cardTitle]}
              onPress={() =>
                promptConfirm(`Contact ${contact.name} ?`, '', 'Call', () => onCall(contact))
              }
              description={() => (
                <View style={[Layout.column, Gutters.largeRMargin]}>
                  <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                    <Icon
                      name="phone"
                      type="font-awesome"
                      color={Colors.primary}
                      style={Gutters.smallRMargin}
                    />
                    <Text style={[Fonts.textRegular, Common.cardDescription]}>
                      {contact.number}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        ))}
        <Divider width={1} />
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
            navigation.navigate('channelsContacts', {
              initialCoords: currentLocationCordinates,
              latitude: null,
              longitude: null,
            });
          }}
          activeOpacity={1}
          style={[Gutters.tinyLPadding, Gutters.smallPadding, { backgroundColor: Colors.shadow }]}
        >
          <Text
            style={[
              Layout.alignSelfStart,
              Gutters.smallLPadding,
              Gutters.tinyBMargin,
              styles.locationLabel,
            ]}
          >
            Location selected
          </Text>
          <View style={[Layout.rowBetween, Layout.alignItemsCenter]}>
            <Text style={Gutters.smallLPadding}>{selectedAddress}</Text>
            <Icon name="location-pin" type="entypo" size={25} style={[Gutters.smallRMargin]} />
          </View>
        </TouchableOpacity>

        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={channelsContacts}
          renderItem={renderContactDetails}
          keyExtractor={(item) => String(item.number)}
        />
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  locationLabel: { fontSize: 11 },
});

export default ContactDetailsScreen;
