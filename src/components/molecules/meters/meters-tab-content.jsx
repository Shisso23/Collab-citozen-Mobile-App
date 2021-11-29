import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { List } from 'react-native-paper';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const MetersTabContent = () => {
  const navigation = useNavigation();
  const { Gutters, Common, Layout } = useTheme();

  const renderDescription = (meter) => {
    return (
      <View style={[Layout.rowBetween, Gutters.smallTMargin]}>
        <Text style={Common.cardDescription}>{_.get(meter, 'meterNumber', '')}</Text>
      </View>
    );
  };

  const showMeterHistory = (item) => {
    return navigation.navigate('ReadingsHistory', {
      meter: item,
    });
  };
  const renderMeters = () => {
    const meterTypes = [
      // TODO get meters endpoint
      { type: 'Electricity', meterNumber: '4712837438', date: new Date() },
      { type: 'Water', meterNumber: '4224234223', date: new Date() },
    ];
    return meterTypes.map((meter, index) => {
      return (
        <>
          <View
            key={`${index * index}-`}
            style={[Common.textInputWithShadow, Gutters.smallMargin, styles.meterItem]}
          >
            <List.Item
              title={_.get(meter, 'type', '')}
              description={() => renderDescription(meter)}
              onPress={() => showMeterHistory(meter)}
              titleStyle={Common.cardTitle}
            />
          </View>
          {index === meterTypes.length - 1 && (
            <Text style={styles.instruction}>
              Your balances are updated each time you get a bill, make a payment or submit a meter
              reading
            </Text>
          )}
        </>
      );
    });
  };

  return (
    <>
      <View style={[Layout.fullSize, Layout.fill, Gutters.smallPadding]}>
        <Text style={[Gutters.smallMargin, styles.title]}>My Meters</Text>
        {renderMeters()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  instruction: { color: Colors.darkgray, textAlign: 'center' },
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

MetersTabContent.defaultProps = {};

export default MetersTabContent;
