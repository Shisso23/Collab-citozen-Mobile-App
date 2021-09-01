import React, { useRef, useEffect } from 'react';
import { SwipeRow } from 'react-native-swipe-list-view';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SIZE = 65;
const SwipeRowContainer = ({
  renderVisibleComponent,
  renderHiddenComponent,
  preview,
  onPreviewEnd,
  swipeKey,
}) => {
  const SwipeRowRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    SwipeRowRef.current.closeRow();
  }, [isFocused]);

  return (
    <SwipeRow
      ref={SwipeRowRef}
      swipeKey={swipeKey}
      preview={preview}
      onPreviewEnd={onPreviewEnd}
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
  onPreviewEnd: PropTypes.func.isRequired,
  preview: PropTypes.bool,
  swipeKey: PropTypes.string,
};

SwipeRowContainer.defaultProps = {
  preview: true,
  swipeKey: '',
};

export default SwipeRowContainer;
