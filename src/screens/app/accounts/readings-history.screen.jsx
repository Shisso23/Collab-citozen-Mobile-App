import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const ReadingsHistoryScreen = ({ route }) => {
  const [readings, setReadings] = useState([
    { type: 'Electricity', readingNumber: '4712837438', date: new Date() },
    { type: 'Water', readingNumber: '4224234223', date: new Date() },
  ]); // get from reducer
  const meter = _.get(route, 'params.meter', '');
  const meterType = _.get(meter, 'type', '');

  const { Gutters, Common, Layout, Fonts } = useTheme();

  // const sortReadings = (unsortedreadings) => { TODO make mock api and model. See readings tab content
  //   return unsortedreadings.sort((st1, st2) => {
  //     if (_.get(st1, 'month', '') > _.get(st2, 'month', '')) {
  //       return -1;
  //     }
  //     if (_.get(st1, 'month', '') < _.get(st2, 'month', '')) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // };

  const fetchElectricityReadings = () => {};
  const fetchWaterReadings = () => {};

  useEffect(() => {
    if (meterType.toLowerCase() === 'electricity') {
      fetchElectricityReadings();
    } else {
      fetchWaterReadings();
    }
    return () => {
      setReadings([]); // Remove. just testing
    };
  }, []);

  const renderDescription = (item) => {
    return (
      <View style={[Layout.rowBetween, Gutters.smallTMargin]}>
        <Text style={[Common.cardDescription, { color: Colors.darkgray }]}>Reading</Text>
        <Text style={Common.cardDescription}>{_.get(item, 'readingNumber')}</Text>
      </View>
    );
  };

  const _handleOpenreading = () => {};

  const renderReadingItem = ({ item }) => {
    const readingMonth = moment(_.get(item, 'date', new Date())).month();
    const readingYear = moment(_.get(item, 'date', new Date())).year();
    const dateString = `${readingYear}/${readingMonth}`;
    return (
      <>
        <View style={[Common.textInputWithShadow, Gutters.smallVMargin, styles.readingItem]}>
          <List.Item
            title={moment(dateString, 'YYYY/MM').format('MMMM YYYY')}
            description={() => renderDescription(item)}
            onPress={() => _handleOpenreading(item)}
            titleStyle={Common.cardTitle}
          />
        </View>
      </>
    );
  };

  return (
    <>
      <View style={[Layout.fullSize, Layout.fill, Gutters.smallPadding]}>
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>
          {meterType.toLowerCase() === 'electricity' ? 'Electricity History' : 'Water History'}
        </Text>
        <Text style={[styles.meterDetails, Gutters.smallLMargin]}>
          {_.get(meter, 'meterNumber', '')}
        </Text>

        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={readings}
          renderItem={renderReadingItem}
          keyExtractor={(item, index) => `${_.get(item, 'readingNumber', index)}`}
        />
      </View>
    </>
  );
};

ReadingsHistoryScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  meterDetails: {
    color: Colors.darkgray,
  },
  readingItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.16,
  },
});

ReadingsHistoryScreen.defaultProps = {};

export default ReadingsHistoryScreen;
