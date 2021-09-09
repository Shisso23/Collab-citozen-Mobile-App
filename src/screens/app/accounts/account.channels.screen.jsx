import React, { useCallback } from 'react';
import { List } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Text, View, ImageBackground, RefreshControl, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import flashService from '../../../services/sub-services/flash-service/flash.service';
import useTheme from '../../../theme/hooks/useTheme';
import { myChannelsSelector } from '../../../reducers/my-channels/my-channels.reducer';
import { getMyChannelsAction } from '../../../reducers/my-channels/my-channels.actions';

const AccountChannelsScreen = () => {
  const dispatch = useDispatch();
  const { myChannels, isLoadingMyChannels } = useSelector(myChannelsSelector);
  const { Common, Gutters, Fonts, Layout, Images, Colors } = useTheme();
  const navigation = useNavigation();

  const _loadMyChannels = () => {
    dispatch(getMyChannelsAction());
  };

  useFocusEffect(
    useCallback(() => {
      _loadMyChannels();
      const accountApplicableChannels = myChannels.filter(
        (channel) => _.get(channel, 'accountApplicable', null) === true,
      );
      if (myChannels.length > 0 && accountApplicableChannels.length === 0) {
        flashService.info('You have no account applicable  channels.');
      }
    }, []),
  );

  const onSelectChannel = (channel) => {
    navigation.navigate('AddAccount', { selectedChannel: channel });
  };

  const _getStatusIndicator = (status) => {
    switch (status) {
      case 'Subscribed':
        return Colors.primary;
      case 'pending':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const viewChannelItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin, styles.channelItem]}>
        <List.Item
          title={item.name}
          onPress={() => onSelectChannel(item)}
          description={() => (
            <View style={[Layout.column, Gutters.largeRMargin]}>
              <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                <View
                  style={[
                    Gutters.tinyHMargin,
                    Common.statusIndicator,
                    { backgroundColor: _getStatusIndicator(item.status) },
                  ]}
                />
                <Text style={Common.cardDescription}>Subscribed</Text>
              </View>
            </View>
          )}
          titleStyle={Common.cardTitle}
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
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>My Channels</Text>
        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={myChannels.filter((channel) => _.get(channel, 'accountApplicable', null) === true)}
          renderItem={viewChannelItem}
          keyExtractor={(item, index) => String(_.get(item, 'obj_id', index))}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingMyChannels}
              onRefresh={_loadMyChannels}
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
  channelItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
});

AccountChannelsScreen.propTypes = {};

AccountChannelsScreen.defaultProps = {};

export default AccountChannelsScreen;
