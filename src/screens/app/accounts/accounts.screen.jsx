import React from 'react';
import { FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Text, ImageBackground, RefreshControl, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { accountActions } from '../../../reducers/accounts-reducer';

const AccountsScreen = () => {
  const dispatch = useDispatch();
  const { accountChannels, isLoadingAccountChannels } = useSelector(accountsSelector);
  const { Common, Gutters, Fonts, Layout, Images, Colors } = useTheme();
  const navigation = useNavigation();

  const _loadMyChannels = () => {
    dispatch(accountActions.getChannelsWithValidAccountsAction());
  };

  useFocusEffect(
    React.useCallback(() => {
      _loadMyChannels();
    }, []),
  );

  const _handleAddAccountPress = () => {
    navigation.navigate('Accountchannels');
  };

  const viewAccountChannelsItem = ({ item, channelIndex }) => {
    return _.map(_.get(item, 'accounts', []), (account, index) => {
      console.log({ account });
      return (
        <TouchableOpacity
          key={`${_.get(account, 'obj_id', index)}/${_.get(item, 'obj_id', channelIndex)}`}
          onPress={() =>
            navigation.navigate('Statements', {
              accountId: _.get(item, 'objectId', ''),
              statements: _.get(item, 'statements', []),
            })
          }
          style={[Common.textInputWithShadow, Gutters.smallTMargin, Gutters.smallPadding]}
        >
          <Text>{_.get(account, 'account_name', '')}</Text>
          <Text>{_.get(account, 'account_number', '')}</Text>
        </TouchableOpacity>
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
          keyExtractor={(item) => String(item.objId)}
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

AccountsScreen.propTypes = {};

AccountsScreen.defaultProps = {};

export default AccountsScreen;
