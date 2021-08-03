import React, { useState, useMemo } from 'react';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import _ from 'lodash';
import useTheme from '../../../theme/hooks/useTheme';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { accountActions } from '../../../reducers/accounts-reducer';
import flashService from '../../../services/sub-services/flash-service/flash.service';

const AddAccounts = ({ selectedChannel }) => {
  const dispatch = useDispatch();
  const { isLoadingAccountValid } = useSelector(accountsSelector);
  const { user } = useSelector((reducer) => reducer.userReducer);
  const userId = useMemo(() => _.get(user, 'user_id', ''), []);
  const { Common, Gutters, Colors, Layout } = useTheme();
  const [accountNumber, setAccountNumber] = useState(null);
  const channelId = useMemo(() => _.get(selectedChannel, 'obj_id', ''), []);
  const [accountNumberError, setAccountNumberError] = useState(false);
  const [setAccounts] = useState(_.get(selectedChannel, 'accounts', []));
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (accountNumber === null || `${accountNumber}`.length < 1) {
      return setAccountNumberError(true);
    }
    return dispatch(accountActions.validateAccountAction(channelId, userId, accountNumber))
      .then((newAccounts) => {
        setAccounts(newAccounts);
        flashService.success('Account validated!');
        navigation.navigate('Accounts');
      })
      .catch((error) => {
        flashService.error(_.get(error, 'message', 'Could not verify account!'));
      });
  };

  const handleAccountNumberChange = (accNumber) => {
    setAccountNumberError(false);
    setAccountNumber(accNumber);
  };

  return (
    <>
      <TextInput
        label="Account Number"
        style={[Common.textInput, styles.accountInput]}
        onChangeText={handleAccountNumberChange}
        value={accountNumber}
        error={accountNumberError}
        showSoftInputOnFocus={false}
        multiline={false}
      />
      {accountNumberError && (
        <Text style={[Gutters.smallMargin, Common.errorStyle]}>
          Account. No. Should be of length 10
        </Text>
      )}

      <Button
        mode="contained"
        style={[
          Gutters.largeMargin,
          Gutters.tinyVPadding,
          Layout.alignSelfCenter,
          Gutters.largeHPadding,
          { backgroundColor: Colors.secondary },
          styles.submitBUtton,
        ]}
        onPress={handleSubmit}
        loading={isLoadingAccountValid}
        disabled={isLoadingAccountValid}
      >
        Verify
      </Button>
    </>
  );
};

AddAccounts.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};

AddAccounts.defaultProps = {};

const styles = StyleSheet.create({
  accountInput: {
    marginHorizontal: '3.5%',
  },
  submitBUtton: {
    bottom: 0,
    position: 'absolute',
  },
});

export default AddAccounts;
