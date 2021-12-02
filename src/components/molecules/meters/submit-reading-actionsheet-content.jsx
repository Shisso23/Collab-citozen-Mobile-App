import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const SubmitReadingActionSheetContent = ({ onSelect }) => {
  const { Gutters, Layout } = useTheme();

  const renderInstruction = () => {
    return (
      <>
        <View
          style={[
            styles.circle,
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            Layout.alignSelfCenter,
            Gutters.smallBMargin,
          ]}
        >
          <Text style={styles.instructionText}>767</Text>
        </View>
        <Text style={[styles.instructionText, Layout.alignSelfCenter]}>
          Which meter are we reading?
        </Text>
      </>
    );
  };
  return (
    <View style={[Gutters.largePadding, Gutters.regularTPadding]}>
      {renderInstruction()}
      <ListItem
        style={Gutters.regularTMargin}
        topDivider
        onPress={() => {
          onSelect('electricity');
        }}
      >
        <ListItem.Content style={Layout.rowBetween}>
          <ListItem.Title>Electricity</ListItem.Title>
          <Icon name="chevron-right" color={Colors.darkgray} />
        </ListItem.Content>
      </ListItem>

      <ListItem
        topDivider
        onPress={() => {
          onSelect('water');
        }}
      >
        <ListItem.Content style={[Layout.rowBetween, Gutters.largeBMargin]}>
          <ListItem.Title>Water</ListItem.Title>
          <Icon name="chevron-right" color={Colors.darkgray} />
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    borderColor: Colors.softBlue,
    borderRadius: 20,
    borderWidth: 1.5,
    height: 38,
    width: 38,
  },
  instructionText: { color: Colors.softBlue, fontWeight: '600' },
});

SubmitReadingActionSheetContent.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
SubmitReadingActionSheetContent.defaultProps = {};

export default SubmitReadingActionSheetContent;
