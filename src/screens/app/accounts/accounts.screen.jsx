import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, Text, View } from 'react-native';
import { List } from 'react-native-paper';
import useTheme from '../../../theme/hooks/useTheme';
import { getAccountsAction } from '../../../reducers/accounts-reducer/accounts.actions';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { accountActions } from '../../../reducers/accounts-reducer';

const AccountsScreen = () => {
  const dispatch = useDispatch();
  const { accounts, isLoadingAccountsRequest } = useSelector(accountsSelector);
  const { Gutters, Fonts, Common } = useTheme();

  const _loadAccountsRequest = () => {
    dispatch(getAccountsAction());
  };

  useEffect(() => {
    dispatch(accountActions.validateAccountAction('hyacinthe.ebula21@gmail.com', '123456789'));
    dispatch(accountActions.getAccountStatementsAction('123'));
    dispatch(accountActions.getChannelsWithValidAccountsAction());
    _loadAccountsRequest();
  }, []);

  const accountItem = ({ item }) => {
    return (
      <View style={[Gutters.tinyVMargin, Common.textInputWithShadow]}>
        <List.Item
          title={item.name}
          description={`Reference Number: ${item.number}`}
          onPress={() => {}}
          titleNumberOfLines={4}
          titleStyle={[Common.blackText]}
          descriptionStyle={[Common.blackText]}
        />
      </View>
    );
  };

  return (
    <>
      <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Accounts</Text>
      <FlatList
        contentContainerStyle={[Gutters.smallHMargin]}
        data={accounts}
        renderItem={accountItem}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoadingAccountsRequest}
        onRefresh={_loadAccountsRequest}
      />
    </>
  );
};

AccountsScreen.propTypes = {};

AccountsScreen.defaultProps = {};

export default AccountsScreen;
