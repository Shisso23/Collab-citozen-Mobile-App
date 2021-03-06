import React, { useEffect, useState } from 'react';
import { ViewPropTypes, View, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { HelperText, TextInput, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import useTheme from '../../../theme/hooks/useTheme';
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';

navigator.geolocation = require('react-native-geolocation-service');

const SubscribeToChannelsForm = ({ containerStyle, unsubscribedChannels }) => {
  const { Common, Gutters, Colors } = useTheme();
  const { selectedAddress } = useSelector(locationSelector);
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  const memoizedChannels = Object.keys(unsubscribedChannels);
  const channels = [];

  for (let i = 0; i < Object.keys(unsubscribedChannels).length; i += 1) {
    const municipalitiyId = unsubscribedChannels[memoizedChannels[i]].objId;
    const municipalityName = unsubscribedChannels[memoizedChannels[i]].name;

    const interestTypes = unsubscribedChannels[memoizedChannels[i]].interest_types;
    const interestTypeArr = [];

    for (let y = 0; y < Object.keys(interestTypes).length; y += 1) {
      interestTypeArr.push(interestTypes[y]);
    }

    channels.push({
      ObjId: municipalitiyId,
      name: municipalityName,
      interest_type: interestTypeArr,
    });
  }

  const subscribeToItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin, styles.channelItem]}>
        <List.Item
          title={item.name}
          onPress={() => {
            navigation.navigate('ViewSubscribingChannelsDetailsScreen', { channelItem: item });
          }}
          titleNumberOfLines={2}
          titleStyle={Common.cardTitle}
        />
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      <TextInput
        value={address}
        label="Location Selected"
        underlineColor={Colors.transparent}
        onFocus={() => navigation.navigate('SelectLocationScreen')}
      />
      <HelperText />
      <FlatList
        data={channels}
        renderItem={subscribeToItem}
        keyExtractor={(item) => String(item.ObjId)}
      />
    </View>
  );
};

SubscribeToChannelsForm.propTypes = {
  containerStyle: ViewPropTypes.style,
  unsubscribedChannels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

SubscribeToChannelsForm.defaultProps = {
  containerStyle: {},
};

const styles = StyleSheet.create({
  channelItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
});

export default SubscribeToChannelsForm;
