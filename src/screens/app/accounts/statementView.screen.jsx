import React, { useState } from 'react';
import {
  Text,
  ImageBackground,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'moment';
import { Icon } from 'react-native-elements';
import { Menu } from 'react-native-paper';
import Share from 'react-native-share';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import AccountStatement from '../../../components/molecules/add-account/AccountStatement';
import { flashService } from '../../../services';

const { height } = Dimensions.get('window');

const StatementViewScreen = ({ route }) => {
  const { params } = route;
  const statement = _.get(params, 'statement', {});
  const [showShareModal, setShowShareModal] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const { Gutters, Layout, Images } = useTheme();
  const year = _.get(statement, 'year', '');
  const month = _.get(statement, 'month', '');
  const dateString = `${year}/${month}`;

  const handleDownloadStatement = (showDownloadStatus = true) => {
    const { config, fs } = RNFetchBlob;
    const { DownloadDir } = fs.dirs;
    const fileId = _.get(statement, 'fileId', Moment(new Date()).format('YYYY_MM_DD_HH_MM_SS'));
    setShowShareModal(false);
    const options = {
      MimeType: 'application/pdf',
      appendExt: 'pdf',
      path: `${DownloadDir}/${fileId}.pdf`,

      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'Download statement',
        path: `${DownloadDir}/${fileId}.pdf`,
        description: 'Downloading file.',
      },
    };
    if (showDownloadStatus) {
      flashService.info('Downloading...');
    }
    config(options)
      .fetch(
        'GET',
        _.get(statement, 'statementPdf.uri', ''),
        _.get(statement, 'statementPdf.headers', ''),
      )
      .then(() => {
        setFilePath(`${DownloadDir}/${fileId}.pdf`);
        return showDownloadStatus ? flashService.success('Download Completed') : null;
      })
      .catch(() => {
        setFilePath(null);
        return showDownloadStatus ? flashService.error('Could not download statement!') : null;
      });
  };

  const handleShareStatement = async () => {
    setShowShareModal(false);
    if (!filePath) {
      handleDownloadStatement(false);
    }
    try {
      const result = await Share.open({
        title: 'Share this statement',
        url: `file://${filePath}` || '',
      });

      return result;
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, Gutters.smallTMargin]}
        resizeMode="cover"
      >
        <View style={[Layout.rowBetween, Layout.alignSelfEnd, styles.titleContainer]}>
          <Text style={[Layout.alignSelfCenter, Gutters.smallBPadding, styles.title]}>
            {Moment(dateString, 'YYYY/MM').format('MMMM YYYY')}
          </Text>
          <View>
            <Icon
              name="dots-vertical"
              type="material-community"
              style={Gutters.largeLMargin}
              onPress={() => {
                setShowShareModal(true);
              }}
            />
            <Menu
              style={[Layout.alignSelfCenter, styles.menu]}
              visible={showShareModal}
              onDismiss={() => {
                setShowShareModal(false);
              }}
              anchor={<Text />}
              contentStyle={Gutters.smallPadding}
            >
              <TouchableOpacity
                onPress={handleDownloadStatement}
                style={[Gutters.regularVMargin, styles.reportMenuTitle]}
              >
                <Text>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShareStatement} style={styles.reportMenuTitle}>
                <Text>Share</Text>
              </TouchableOpacity>
            </Menu>
          </View>
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
  titleContainer: { width: '65%' },
});

StatementViewScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

StatementViewScreen.defaultProps = {};

export default StatementViewScreen;
