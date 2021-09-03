import React, { useEffect, useState } from 'react';
import { List } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { FlatList, Text, View, ImageBackground, Linking, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { getContactDetailsAction } from '../../../reducers/contacts-reducer/contacts.actions';

const ContactDetailsScreen = ({ route }) => {
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();
  const { params } = route;
  const [currentLocationCordinates, setCurrentLocationCordinates] = useState({
    latitude: null,
    longitude: null,
    atitudeDelta: 0.00922 * 1.5,
    longitudeDelta: 0.00421 * 1.5,
  });
  const { contactDetails } = params;

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log({ position });
        setCurrentLocationCordinates({
          ...currentLocationCordinates,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log({ error });
      },
      { timeout: 600, maximumAge: 0, enableHightAccuracy: true },
    );
  }, []);

  useEffect(() => {
    getContactDetailsAction(currentLocationCordinates);
    console.log({ changed: currentLocationCordinates });
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

  const callPrompt = (item) => {
    Alert.alert(
      `Call for ${item.name} ?`,
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => onCall(item),
        },
      ],
      { cancelable: false },
    );
  };

  const renderContactDetails = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.name}
          titleStyle={Common.cardTitle}
          onPress={() => callPrompt(item)}
          description={() => (
            <View style={[Layout.column, Gutters.largeRMargin]}>
              <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                <Icon
                  name="phone"
                  type="font-awesome"
                  color={Colors.primary}
                  style={Gutters.smallRMargin}
                />
                <Text style={[Fonts.textRegular, Common.cardDescription]}>{item.number}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <>
      {/* <TextInput
        value={address}
        label="Location Selected"
        underlineColor={Colors.transparent}
        onFocus={() => navigation.navigate('SelectLocationScreen')}
      /> */}
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Contact details</Text>
        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={contactDetails}
          renderItem={renderContactDetails}
          keyExtractor={(item) => String(item.number)}
        />
      </ImageBackground>
    </>
  );
};

ContactDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

ContactDetailsScreen.defaultProps = {};

export default ContactDetailsScreen;
