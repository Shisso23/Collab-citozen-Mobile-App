import React from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { List } from 'react-native-paper';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { getMeterReadingsAction } from '../../../reducers/account-meters/account-meters.actions';
import { meterReadingsSelector } from '../../../reducers/account-meters/account-meters.reducer';

const MetersTabContent = ({ meters, accountNumber, channelRef }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoadingMeterReadings } = useSelector(meterReadingsSelector);
  const { Gutters, Common, Layout } = useTheme();

  const getMeterReadings = async (meterObjId) => {
    return dispatch(getMeterReadingsAction({ meterObjId }));
  };

  const renderDescription = (meter) => {
    return (
      <View style={[Layout.rowBetween, Gutters.smallTMargin]}>
        <Text style={Common.cardDescription}>{_.get(meter, 'meterNumber', '')}</Text>
      </View>
    );
  };

  const renderLoadingIndicator = () => {
    return (
      <ActivityIndicator
        animating={isLoadingMeterReadings}
        color={Colors.primary}
        style={Gutters.tinyTMargin}
        size={25}
      />
    );
  };

  const showMeterHistory = (item) => {
    getMeterReadings(item.objId).then(() => {
      return navigation.navigate('ReadingsHistory', {
        meter: item,
        accountNumber,
        channelRef,
      });
    });
  };
  const renderMeters = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.smallMargin, styles.meterItem]}>
        <List.Item
          title={_.get(item, 'type', '')}
          description={() => renderDescription(item)}
          onPress={() => showMeterHistory(item)}
          titleStyle={Common.cardTitle}
          right={renderLoadingIndicator}
        />
      </View>
    );
  };

  return (
    <>
      <View style={[Layout.fullSize, Layout.fill, Gutters.smallPadding]}>
        <Text style={[Gutters.smallMargin, styles.title]}>My Meters</Text>
        <FlatList
          data={meters}
          renderItem={renderMeters}
          keyExtractor={(item) => item.meterNumber}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  meterItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.16,
  },
  title: { fontSize: 16, fontWeight: '500' },
});

MetersTabContent.propTypes = {
  meters: PropTypes.array.isRequired,
  accountNumber: PropTypes.string.isRequired,
  channelRef: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

MetersTabContent.defaultProps = {};

export default MetersTabContent;
