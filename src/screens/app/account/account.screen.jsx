import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';
import useTheme from '../../../theme/hooks/useTheme';
import { getAccountsAction } from '../../../reducers/accounts-reducer/accounts.actions';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';

const AccountScreen = () => {
  const dispatch = useDispatch();
  const { accounts, isLoadingAccountsRequest } = useSelector(accountsSelector);
  const { Gutters } = useTheme();

  const _loadAccountsRequest = () => {
    dispatch(getAccountsAction());
  };

  useEffect(() => {
    _loadAccountsRequest();
  }, []);

  const accountItem = ({ item }) => {
    return <List.Item title={item.name} description={`Acc: ${item.number}`} onPress={() => {}} />;
  };

  return (
    <>
      <FlatList
        contentContainerStyle={[Gutters.regularTMargin, Gutters.regularHMargin]}
        data={accounts}
        renderItem={accountItem}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoadingAccountsRequest}
        onRefresh={_loadAccountsRequest}
      />
    </>
  );
};

AccountScreen.propTypes = {};

AccountScreen.defaultProps = {};

export default AccountScreen;
