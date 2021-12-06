import React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { List } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const MetersTabContent = ({ meters, accountNumber, channelRef }) => {
  const navigation = useNavigation();
  const { Gutters, Common, Layout } = useTheme();

  const renderDescription = (meter) => {
    return (
      <View style={[Layout.rowBetween, Gutters.smallTMargin]}>
        <Text style={Common.cardDescription}>{_.get(meter, 'meterNumber', '')}</Text>
      </View>
    );
  };

  const submitMeterReading = (item) => {
    navigation.navigate('SubmitReading', { meter: item, channelRef });
  };

  const renderAddMeterButton = (item) => {
    return (
      <Pressable
        onPress={() => submitMeterReading(item)}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
      >
        {({ pressed }) => {
          return (
            <Icon
              name="add-circle-outline"
              style={[Gutters.regularTMargin]}
              size={35}
              type="meterial-icons"
              color={Colors.softBlue}
              backgroundColor={pressed ? Colors.gray : Colors.transparent}
            />
          );
        }}
      </Pressable>
    );
  };

  const showMeterHistory = (item) => {
    return navigation.navigate('ReadingsHistory', {
      meter: item,
      accountNumber,
    });
  };
  const renderMeters = ({ item, index }) => {
    return (
      <>
        <View style={[Common.textInputWithShadow, Gutters.smallMargin, styles.meterItem]}>
          <List.Item
            title={_.get(item, 'type', '')}
            description={() => renderDescription(item)}
            onPress={() => showMeterHistory(item)}
            titleStyle={Common.cardTitle}
            right={() => renderAddMeterButton(item)}
          />
        </View>
        {index === meters.length - 1 && (
          <Text style={styles.instruction}>Press + button to submit meter reading</Text>
        )}
      </>
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

MetersTabContent.propTypes = {
  meters: PropTypes.array.isRequired,
  accountNumber: PropTypes.string.isRequired,
  channelRef: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

MetersTabContent.defaultProps = {};

export default MetersTabContent;
