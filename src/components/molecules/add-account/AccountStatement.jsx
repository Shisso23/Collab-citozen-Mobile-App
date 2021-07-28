import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FlashService from '../../../services/sub-services/flash-service/flash.service';
import LoadingComponent from '../loading/loading.component';
import useTheme from '../../../theme/hooks/useTheme';

const AccountStatement = ({ statement }) => {
  const { Layout } = useTheme();
  const source = _.get(statement, 'statementPdf', {});

  return (
    <View style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentFlexStart]}>
      <Pdf
        source={source}
        onError={(error) => {
          FlashService.error(_.get(error, 'message', 'Error while loading pdf!'));
        }}
        activityIndicator={<LoadingComponent style={styles.loadingComponent} size="small" />}
        style={[Layout.fill, styles.pdf]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingComponent: { height: 30, width: 30 },
  pdf: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

AccountStatement.propTypes = {
  statement: PropTypes.object.isRequired,
};

export default AccountStatement;
