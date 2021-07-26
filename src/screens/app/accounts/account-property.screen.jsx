import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, Text, View } from 'react-native';
import { List } from 'react-native-paper';
import useTheme from '../../../theme/hooks/useTheme';
import { getAccountsPropertyAction } from '../../../reducers/accounts-reducer/accountProperties.actions';
import { accountsPropertySelector } from '../../../reducers/accounts-reducer/accountProperties.reducer';

const AccountScreen = () => {
  const dispatch = useDispatch();
  const { accounts, isLoadingAccountsRequest } = useSelector(accountsPropertySelector);
  const { Gutters, Fonts, Common } = useTheme();

  const _loadAccountsRequest = () => {
    dispatch(getAccountsPropertyAction());
  };

  useEffect(() => {
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

AccountScreen.propTypes = {};

AccountScreen.defaultProps = {};

export default AccountScreen;
