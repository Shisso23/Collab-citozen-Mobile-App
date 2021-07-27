import React, { useEffect, useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { accountActions } from '../../../reducers/accounts-reducer';
import flashService from '../../../services/sub-services/flash-service/flash.service';

const Accounts = ({ selectedChannel }) => {
  const dispatch = useDispatch();
  const { isLoadingAccountValid } = useSelector(accountsSelector);
  const { user } = useSelector((reducer) => reducer.userReducer);
  const userId = _.get(user, 'user_id', '');
  const { Common, Gutters, Layout, Colors } = useTheme();
  const [addingAccount, setAddingAccount] = useState(false);
  const [newAccountNumber, setnewAccountNumber] = useState(null);
  const channelId = _.get(selectedChannel, 'obj_id', '');
  const [accounts, setAccounts] = useState(_.get(selectedChannel, 'accounts', []));
  const navigation = useNavigation();

  useEffect(() => {}, [accounts.length]);

  const handleSubmit = () => {
    dispatch(accountActions.validateAccountAction(channelId, userId, newAccountNumber))
      .then((newAccounts) => {
        setAccounts(newAccounts);
        flashService.success('Account validated!');
      })
      .catch((error) => {
        flashService.error(_.get(error, 'message', 'Could not validate account!'));
      });
  };

  return (
    <>
      <View style={[Layout.rowBetween, Gutters.smallHMargin]}>
        <Text>Add Account</Text>
        <TouchableOpacity
          onPress={() => {
            setAddingAccount(!addingAccount);
          }}
        >
          <Icon name={!addingAccount ? 'plus-circle' : 'close-circle'} size={25} />
        </TouchableOpacity>
      </View>

      {addingAccount && (
        <TextInput
          label="Account Number"
          style={[Common.textInput, styles.accountInput]}
          onChangeText={(accNumber) => setnewAccountNumber(accNumber)}
          value={newAccountNumber}
          showSoftInputOnFocus={false}
          multiline={false}
        />
      )}
      <FlatList
        contentContainerStyle={Gutters.smallHMargin}
        data={accounts}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Statements', {
                  accountId: _.get(item, 'objectId', ''),
                  statements: _.get(item, 'statements', []),
                })
              }
              style={[Common.textInputWithShadow, Gutters.smallTMargin, Gutters.smallPadding]}
            >
              <Text>{_.get(item, 'account_name', '')}</Text>
              <Text>{_.get(item, 'account_number', '')}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => String(item.objectId)}
      />

      {`${newAccountNumber}`.length >= 10 && (
        <Button
          mode="contained"
          style={[Gutters.largeMargin, Gutters.tinyVPadding, { backgroundColor: Colors.secondary }]}
          onPress={handleSubmit}
          loading={isLoadingAccountValid}
          disabled={isLoadingAccountValid}
        >
          Verify
        </Button>
      )}
    </>
  );
};

Accounts.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

Accounts.defaultProps = {};

const styles = StyleSheet.create({
  accountInput: {
    marginHorizontal: '3.5%',
  },
});

export default Accounts;
