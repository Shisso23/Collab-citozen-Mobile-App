import React, { useMemo, useState } from 'react';
import { StyleSheet, Dimensions, SafeAreaView, View } from 'react-native';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Icon } from 'react-native-elements';
import FlashService from '../../../services/sub-services/flash-service/flash.service';
import LoadingComponent from '../loading/loading.component';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const AccountStatement = ({ statement }) => {
  const { Layout, Gutters } = useTheme();

  const source = useMemo(() => _.get(statement, 'statementPdf', {}), []);
  const [pdfScale, setPdfScale] = useState(1);

  const upDatePdfScale = (value) => () => {
    setPdfScale(Math.max(1, value));
  };

  return (
    <SafeAreaView style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentFlexStart]}>
      <Pdf
        source={source}
        onError={(error) => {
          FlashService.error(_.get(error, 'message', 'Error while loading pdf!'));
        }}
        scale={pdfScale}
        activityIndicator={<LoadingComponent style={styles.loadingComponent} size="small" />}
        style={[styles.pdf, Gutters.largeBPadding]}
        fitPolicy={5}
        scrollIndicatorInsets={{ right: 0 }}
        maxScale={8}
        minScale={1}
      >
        <View style={[styles.zoomButtons, Gutters.tinyHPadding]}>
          <Icon
            name="squared-plus"
            type="entypo"
            size={40}
            onPress={upDatePdfScale(pdfScale + 1)}
          />
          <View style={styles.separator} />
          <Icon
            name="squared-minus"
            type="entypo"
            size={40}
            onPress={upDatePdfScale(pdfScale - 1)}
          />
        </View>
      </Pdf>
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
  separator: { backgroundColor: Colors.gray, height: 1, width: '100%' },
  zoomButtons: {
    backgroundColor: Colors.white,
    bottom: 60,
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
});

AccountStatement.propTypes = {
  statement: PropTypes.object.isRequired,
};

export default AccountStatement;
