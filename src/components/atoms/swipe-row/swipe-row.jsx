import React from 'react';
import { SwipeRow } from 'react-native-swipe-list-view';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SIZE = 65;
const SwipeRowContainer = ({ renderVisibleComponent, renderHiddenComponent, key }) => {
  return (
    <SwipeRow
      preview
      previewOpenValue={-SIZE}
      previewDuration={1500}
      key={key}
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
  renderHiddenComponent: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
  renderVisibleComponent: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

SwipeRowContainer.defaultProps = {};

export default SwipeRowContainer;
