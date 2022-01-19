import React, { useEffect, useCallback, useRef, useState } from 'react';
import { List } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import {
  FlatList,
  Text,
  View,
  ImageBackground,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Platform,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ActionSheet from 'react-native-actions-sheet';
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
import { flashService } from '../../../services';
import ContactsActionSheetContent from '../../../components/molecules/contacts-actionsheet-content';

const ContactDetailsScreen = () => {
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();
  const actionSheetRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { channelsContacts, isLoadingChannelsContacts } = useSelector(channelContactsSelector);
  const { selectedAddress, region } = useSelector(locationSelector);
  const [contactDetails, setContactDetails] = useState({});
  const defaultMessage = 'Hi';

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

  const handleLinkingFail = () => {
    return flashService.error('Could not complete the operation!');
  };

  const handleLinkingResponse = (link) => {
    Linking.openURL(link)
      .then((supported) => {
        if (!supported) {
          return flashService.error('Operation is not supported!');
        }
        return Linking.openURL(link);
      })
      .catch(handleLinkingFail);
  };

  const handleContactAction = (action) => {
    let link;
    const separator = Platform.OS === 'ios' ? '&' : '?';
    switch (action) {
      case 'call':
        link = `tel://${contactDetails.number.replace(/\s/g, '')}`;
        break;
      case 'whatsapp':
        link = `whatsapp://send?text=${defaultMessage}&phone=+27${contactDetails?.number
          .replace(/\s/g, '')
          .substring(1)}`;
        break;
      case 'sms':
        link = `sms:${contactDetails.number.replace(/\s/g, '')}${separator}body=${defaultMessage}`;
        break;
      default:
        link = `tel://${contactDetails.number.replace(/\s/g, '')}`;
    }
    handleLinkingResponse(link);
  };

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

  const openActionSheet = (item) => {
    setContactDetails(item);
    return actionSheetRef.current?.setModalVisible(true);
  };

  const closeActionSheet = () => {
    return actionSheetRef.current?.setModalVisible(false);
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
              onPress={() => openActionSheet(contact)}
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
      <ActionSheet ref={actionSheetRef} gestureEnabled>
        <ContactsActionSheetContent
          handleContactAction={handleContactAction}
          closeActionSheet={closeActionSheet}
        />
      </ActionSheet>
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
