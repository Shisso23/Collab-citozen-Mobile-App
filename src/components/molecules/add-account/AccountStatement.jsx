import React, { useMemo } from 'react';
import { StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FlashService from '../../../services/sub-services/flash-service/flash.service';
import LoadingComponent from '../loading/loading.component';
import useTheme from '../../../theme/hooks/useTheme';

const AccountStatement = ({ statement }) => {
  const { Layout, Gutters } = useTheme();

  const source = useMemo(() => _.get(statement, 'statementPdf', {}), []);

  return (
    <SafeAreaView style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentFlexStart]}>
      <Pdf
        source={source}
        onError={(error) => {
          FlashService.error(_.get(error, 'message', 'Error while loading pdf!'));
        }}
        activityIndicator={<LoadingComponent style={styles.loadingComponent} size="small" />}
        style={[styles.pdf, Gutters.largeBPadding]}
        fitPolicy={1}
        scrollIndicatorInsets={{ right: 0 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingComponent: { height: 30, width: 30 },
  pdf: {
    alignSelf: 'flex-start',
    height: Dimensions.get('screen').height - Dimensions.get('screen').height * 0.3,
    width: Dimensions.get('screen').width,
  },
});

AccountStatement.propTypes = {
  statement: PropTypes.object.isRequired,
};

export default AccountStatement;
