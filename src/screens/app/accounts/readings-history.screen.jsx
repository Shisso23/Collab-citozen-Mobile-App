import React, { useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { List, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import {
  getElectricityMeterReadingsAction,
  getWaterMeterReadingsAction,
} from '../../../reducers/account-meters/account-meters.actions';
import { meterReadingsSelector } from '../../../reducers/account-meters/account-meters.reducer';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const ReadingsHistoryScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { meterReadings, isLoadingMeterReadings } = useSelector(meterReadingsSelector);
  const meter = _.get(route, 'params.meter', '');
  const meterType = _.get(meter, 'type', '').toLowerCase();
  const meterNumber = _.get(meter, 'meterNumber', '');
  const accountNumber = _.get(route, 'params.accountNumber', '');
  const channelRef = _.get(route, 'params.channelRef', '');
  const navigation = useNavigation();

  const { Gutters, Common, Layout, Fonts } = useTheme();

  const fetchElectricityReadings = () => {
    dispatch(getElectricityMeterReadingsAction({ meterNumber, accountNumber }));
  };
  const fetchWaterReadings = () => {
    dispatch(getWaterMeterReadingsAction({ meterNumber, accountNumber }));
  };

  useEffect(() => {
    refreshReadings();
  }, []);

  const refreshReadings = () => {
    if (meterType === 'electricity') {
      fetchElectricityReadings();
    } else {
      fetchWaterReadings();
    }
  };

  const renderDescription = (item) => {
    return (
      <View style={[Layout.rowBetween, Gutters.smallTMargin]}>
        <Text style={[Common.cardDescription, { color: Colors.darkgray }]}>Reading</Text>
        <Text style={Common.cardDescription}>{_.get(item, 'readingNumber')}</Text>
      </View>
    );
  };

  const _handleOpenreading = () => {};

  const addMeterReading = () => {
    navigation.navigate('SubmitReading', { meter, channelRef });
  };

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
        <Text style={[styles.meterDetails, Gutters.smallLMargin]}>{meterNumber}</Text>

        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={meterReadings}
          renderItem={renderReadingItem}
          keyExtractor={(item, index) => `${_.get(item, 'readingNumber', index)}`}
          refreshing={isLoadingMeterReadings}
          onRefresh={refreshReadings}
        />
      </View>
      <FAB style={[Common.fabAlignment]} icon="plus" onPress={addMeterReading} />
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
