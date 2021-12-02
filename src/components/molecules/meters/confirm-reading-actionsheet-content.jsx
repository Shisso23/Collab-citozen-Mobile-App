import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const ConfirmReadingActionSheetContent = ({ onConfirmReading, onCancel, loading }) => {
  const { Gutters, Layout } = useTheme();

  const renderTitle = () => {
    return (
      <>
        <ListItem style={Gutters.regularTMargin} bottomDivider>
          <Text style={[styles.instructionText, Layout.alignSelfCenter]}>
            Meter reading entered seems to be more than the AVG entered
          </Text>
        </ListItem>
      </>
    );
  };
  return (
    <View style={[Gutters.largePadding, Gutters.regularTPadding]}>
      {renderTitle()}
      <Text style={[{ color: Colors.softBlue }, Layout.alignSelfCenter, Gutters.regularVMargin]}>
        Confirm?
      </Text>
      <TouchableOpacity
        disabled={loading}
        onPress={onConfirmReading}
        style={[
          styles.confirmButton,
          Layout.alignSelfCenter,
          Layout.alignItemsCenter,
          Gutters.largeHPadding,
          Gutters.smallVPadding,
          Gutters.smallBMargin,
        ]}
      >
        {loading && (
          <ActivityIndicator
            style={[styles.loadingIndicator, Layout.alignSelfCenter]}
            animating
            color={Colors.gray}
          />
        )}
        <Text style={{ color: Colors.softBlue }}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCancel}
        style={[
          styles.confirmButton,
          Layout.alignSelfCenter,
          Layout.alignItemsCenter,
          Gutters.largeHPadding,
          Gutters.smallVPadding,
        ]}
      >
        <Text style={{ color: Colors.softBlue }}>No</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    borderColor: Colors.softBlue,
    borderRadius: 8,
    borderWidth: 1,
    width: '60%',
  },
  instructionText: { color: Colors.softBlue, fontWeight: '400', textAlign: 'center' },
  loadingIndicator: {
    position: 'absolute',
  },
});

ConfirmReadingActionSheetContent.propTypes = {
  onConfirmReading: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
ConfirmReadingActionSheetContent.defaultProps = {};

export default ConfirmReadingActionSheetContent;
