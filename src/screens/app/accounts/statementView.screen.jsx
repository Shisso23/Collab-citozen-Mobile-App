import React from 'react';
import { Text, ImageBackground, View, StyleSheet, Dimensions, Alert } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'moment';
import { Icon } from 'react-native-elements';
import Share from 'react-native-share';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import AccountStatement from '../../../components/molecules/add-account/AccountStatement';
import { flashService } from '../../../services';

const { height } = Dimensions.get('window');

const StatementViewScreen = ({ route }) => {
  const { params } = route;
  const statement = _.get(params, 'statement', {});
  const { Gutters, Layout, Images } = useTheme();
  const year = _.get(statement, 'year', '');
  const month = _.get(statement, 'month', '');
  const dateString = `${year}/${month}`;
  const { config, fs } = RNFetchBlob;
  const dirToSave = fs.dirs.DocumentDir;
  const fileId = `${Moment(dateString, 'YYYY/MM').format('MMMM_YYYY')}_statement`;

  const handleShareStatement = () => {
    config({
      fileCache: true,
      path: `${dirToSave}/collab-${fileId}.pdf`,
    })
      .fetch(
        'GET',
        _.get(statement, 'statementPdf.uri', ''),
        _.get(statement, 'statementPdf.headers', ''),
      )
      .then(async (resp) => {
        const { status } = resp.info();

        if (status !== 200) {
          const jsonResult = await resp.json();
          const message = _.get(jsonResult, 'message');
          flashService.error(`Could not download statement: ${message}`);
        }
        Share.open({
          title: `Account statement ${fileId}`,
          url: `file:///${resp.path()}`,
          subject: `Collab/${fileId}`,
          failOnCancel: false,
          showAppsToView: true,
        });
      })
      .catch((error) => {
        Alert.alert('Oh No!', error.message);
      });
  };

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, Gutters.smallTMargin]}
        resizeMode="cover"
      >
        <View
          style={[
            Layout.rowBetween,
            Layout.alignSelfEnd,
            styles.titleContainer,
            Gutters.smallBPadding,
          ]}
        >
          <Text style={[Layout.alignSelfCenter, styles.title]}>
            {Moment(dateString, 'YYYY/MM').format('MMMM YYYY')}
          </Text>
          <Icon
            name="share"
            type="feather"
            size={28}
            containerStyle={Gutters.smallRMargin}
            color={Colors.commentsBubble}
            onPress={handleShareStatement}
          />
        </View>

        <AccountStatement statement={statement} />
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    borderRadius: 15,
    height: height * 0.25,
    position: 'absolute',
    right: 0,
    shadowColor: Colors.black,
    shadowOffset: {
      height: 3,
      width: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    top: '20%',
    width: '60%',
  },
  reportMenuTitle: { fontWeight: '500' },
  title: { fontSize: 16 },
  titleContainer: { width: '63%' },
});

StatementViewScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

StatementViewScreen.defaultProps = {};

export default StatementViewScreen;
