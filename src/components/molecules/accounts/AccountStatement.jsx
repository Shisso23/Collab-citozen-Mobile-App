import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FlashService from '../../../services/sub-services/flash-service/flash.service';
import LoadingComponent from '../loading/loading.component';

const AccountStatement = ({ statement }) => {
  const source = { uri: `${_.get(statement, 'statementUrl', null)}`, cache: true };

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        onError={(error) => {
          FlashService.error(_.get(error, 'message', 'Error while loading pdf!'));
        }}
        activityIndicator={<LoadingComponent style={styles.loadingComponent} size="small" />}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  loadingComponent: { height: 30, width: 30 },
  pdf: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

AccountStatement.propTypes = {
  statement: PropTypes.object.isRequired,
};

export default AccountStatement;
