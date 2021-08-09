import React, { useCallback, useState } from 'react';
import { FAB, List } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Text, ImageBackground, RefreshControl, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// import Moment from 'moment';

import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { accountActions } from '../../../reducers/accounts-reducer';

import { TrashButton } from '../../../components/atoms';
import SwipeRowContainer from '../../../components/atoms/swipe-row/swipe-row';
import { promptConfirmDelete } from '../../../helpers/prompt.helper';

const AccountsScreen = () => {
  const dispatch = useDispatch();
  const { accountChannels, isLoadingAccountChannels } = useSelector(accountsSelector);
  const { Common, Gutters, Fonts, Layout, Images, Colors } = useTheme();
  const navigation = useNavigation();
  const [isDeleting, setDeleting] = useState(false);

  const _loadMyChannels = () => {
    dispatch(accountActions.getChannelsWithValidAccountsAction());
  };

  useFocusEffect(
    useCallback(() => {
      _loadMyChannels();
    }, []),
  );

  const _getStatusIndicator = (status) => {
    switch (status) {
      case 'Denied':
        return Colors.red;
      case 'Granted':
        return Colors.primary;
      case 'Requested':
        return Colors.warning;
      default:
        return Colors.error;
    }
  };

  const _handleAddAccountPress = () => {
    navigation.navigate('Accountchannels');
  };

  const renderAccountDescription = (account) => (
    <View style={([Layout.column, Gutters.largeRMargin], Gutters.tinyTMargin)}>
      <Text>{_.get(account, 'accountNumber', '')}</Text>
      <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
        <View
          style={[
            Gutters.tinyHMargin,
            Common.statusIndicator,
            { backgroundColor: _getStatusIndicator(account.status) },
          ]}
        />
        <Text style={[Fonts.textRegular]}>{account.status}</Text>
      </View>
    </View>
  );

  const onSelectAccount = (account) =>
    navigation.navigate('Statements', {
      accountId: _.get(account, 'objectId', ''),
      statements: _.get(account, 'statements', []),
    });

  const renderVisibleComponent = (account, accountIndex, channel, channelIndex) => {
    return (
      <View
        style={[Common.textInputWithShadow, Gutters.tinyMargin]}
        key={`${channelIndex}-${accountIndex}`}
      >
        <List.Item
          title={_.get(account, 'accountName', '')}
          description={() => renderAccountDescription(account)}
          onPress={() => onSelectAccount(account)}
          right={() => (
            <View style={[Layout.rowVCenter, styles.accountCard]}>
              <Text>{_.get(channel, 'name', '')}</Text>
            </View>
          )}
          descriptionNumberOfLines={10}
          descriptionStyle={[Gutters.largeRMargin]}
        />
      </View>
    );
  };

  const _handleDelete = () => {
    // const deletedAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
    promptConfirmDelete('Are you sure you want to delete this item?', () => {
      setDeleting(true);
      // dispatch(deleteNotificationAction(notificationId, deletedAt, _.get(user, 'user_id', '')));
    });
  };

  const renderHiddenComponent = () => (
    <TrashButton onPress={_handleDelete} iconSize={35} loading={isDeleting} />
  );

  const viewAccountChannelsItem = ({ item, index }) => {
    return _.map(_.get(item, 'accounts', []), (account, accountIndex) => {
      return (
        <SwipeRowContainer
          key={`${_.get(item, 'obj_id', accountIndex)}`}
          renderHiddenComponent={renderHiddenComponent}
          renderVisibleComponent={() => renderVisibleComponent(account, accountIndex, item, index)}
        />
      );
    });
  };

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>My Accounts</Text>

        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={accountChannels}
          renderItem={viewAccountChannelsItem}
          keyExtractor={(item, i) => `${_.get(item, 'obj_id', i)}`}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingAccountChannels}
              onRefresh={_loadMyChannels}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      </ImageBackground>
      <FAB style={[Common.fabAlignment]} icon="plus" onPress={_handleAddAccountPress} />
    </>
  );
};
const styles = StyleSheet.create({
  accountCard: { width: '42%' },
});

export default AccountsScreen;
