import React, { useCallback } from 'react';
import { FAB, List } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  Text,
  ImageBackground,
  RefreshControl,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { accountActions } from '../../../reducers/accounts-reducer';

import { TrashButton } from '../../../components/atoms';
import SwipeRowContainer from '../../../components/atoms/swipe-row/swipe-row';
import { promptConfirm } from '../../../helpers/prompt.helper';
import { previewDeleAccountAction } from '../../../reducers/accounts-reducer/accounts.actions';

const AccountsScreen = () => {
  const dispatch = useDispatch();
  const screenHeight = Dimensions.get('window').height;
  const { accountChannels, isLoadingAccountChannels } = useSelector(accountsSelector);
  const { user } = useSelector((reducer) => reducer.userReducer);
  const { isLoadingDeleteAccount, deleteAccountPreview } = useSelector(
    (reducer) => reducer.accountsReducer,
  );
  const { Common, Gutters, Fonts, Layout, Images, Colors } = useTheme();
  const navigation = useNavigation();

  const _loadMyChannels = () => {
    dispatch(accountActions.getChannelsWithValidAccountsAction(user));
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
      case 'Approved':
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

  const onSelectAccount = (account, accountChannel) =>
    navigation.navigate('AccountDetails', {
      account,
      accountChannel,
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
          onPress={() => onSelectAccount(account, channel)}
          right={() => (
            <View style={[Layout.rowVCenter, styles.accountCard]}>
              <Text style={[Gutters.tinyTMargin, Gutters.regularLMargin]}>
                {_.get(channel, 'name', '')}
              </Text>
            </View>
          )}
          descriptionNumberOfLines={10}
          descriptionStyle={[Gutters.largeRMargin]}
        />
      </View>
    );
  };

  const _handleDelete = (account, channel) => {
    const channelId = _.get(channel, 'objectId', '');
    const accountNumber = _.get(account, 'accountNumber', '');
    promptConfirm('Are you sure?', 'Are you sure you want to delete this item?', 'Delete', () => {
      dispatch(accountActions.deleteAccountAction(channelId, user, accountNumber));
    });
  };

  const renderHiddenComponent = (account, channel) => (
    <TrashButton
      onPress={() => _handleDelete(account, channel)}
      iconSize={35}
      loading={isLoadingDeleteAccount}
    />
  );

  const viewAccountChannelsItem = ({ item, index }) => {
    return _.get(item, 'accounts', []).map((account, accountIndex) => {
      return (
        <SwipeRowContainer
          key={`${_.get(item, 'objectId', accountIndex)}-${_.get(account, 'accountNumber', '')}`}
          swipeKey={`${_.get(item, 'objectId', accountIndex)}-${accountIndex}`}
          preview={deleteAccountPreview && accountIndex === 0 && index === 0}
          onPreviewEnd={() => {
            dispatch(previewDeleAccountAction(false));
          }}
          renderHiddenComponent={() => renderHiddenComponent(account, item)}
          renderVisibleComponent={() => renderVisibleComponent(account, accountIndex, item, index)}
        />
      );
    });
  };

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, ...[{ marginBottom: 110 }]]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>My Accounts</Text>
        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={accountChannels}
          renderItem={viewAccountChannelsItem}
          keyExtractor={(item, i) => `${_.get(item, 'objectId', i)}`}
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
      <FAB
        style={[Common.fabAlignment, { marginBottom: screenHeight - screenHeight * 0.85 }]}
        icon="plus"
        onPress={_handleAddAccountPress}
      />
    </>
  );
};
const styles = StyleSheet.create({
  accountCard: { width: '42%' },
});

export default AccountsScreen;
