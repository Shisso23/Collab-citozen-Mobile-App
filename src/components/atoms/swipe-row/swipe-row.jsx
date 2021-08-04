import React from 'react';
import { SwipeRow } from 'react-native-swipe-list-view';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SIZE = 65;
const SwipeRowContainer = ({ renderVisibleComponent, renderHiddenComponent }) => {
  return (
    <SwipeRow
      preview
      previewOpenValue={-SIZE}
      previewDuration={1500}
      rightOpenValue={-SIZE}
      closeOnRowPress
      disableRightSwipe
    >
      <View style={styles.deleteRow}>{renderHiddenComponent()}</View>
      {renderVisibleComponent()}
    </SwipeRow>
  );
};

const styles = StyleSheet.create({
  deleteRow: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.danger,
    height: SIZE,
    justifyContent: 'center',
    width: SIZE,
  },
});

SwipeRowContainer.propTypes = {
  renderHiddenComponent: PropTypes.func.isRequired,
  renderVisibleComponent: PropTypes.func.isRequired,
};

SwipeRowContainer.defaultProps = {};

export default SwipeRowContainer;
