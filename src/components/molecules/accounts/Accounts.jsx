import React, { useEffect, useState } from 'react';
import { TextInput, Button, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

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
  const { Common, Gutters, Colors } = useTheme();
  const [accountNumber, setAccountNumber] = useState(null);
  const channelId = _.get(selectedChannel, 'obj_id', '');
  const [accounts, setAccounts] = useState(_.get(selectedChannel, 'accounts', []));
  const navigation = useNavigation();

  useEffect(() => {}, [accounts.length]);

  const handleSubmit = () => {
    dispatch(accountActions.validateAccountAction(channelId, userId, accountNumber))
      .then((newAccounts) => {
        setAccounts(newAccounts);
        flashService.success('Account validated!');
      })
      .catch((error) => {
        flashService.error(_.get(error, 'message', 'Could not validate account!'));
      });
  };

  const _handleOnAddAccountPress = () => {
    navigation.navigate('Accounts');
  };

  return (
    <>
      <TextInput
        label="Account Number"
        style={[Common.textInput, styles.accountInput]}
        onChangeText={(accNumber) => setAccountNumber(accNumber)}
        value={accountNumber}
        error={`${accountNumber}`.length < 10}
        showSoftInputOnFocus={false}
        multiline={false}
      />

      {`${accountNumber}`.length >= 10 && (
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
      <FAB style={[Common.fabAlignment]} icon="plus" onPress={_handleOnAddAccountPress} />
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
