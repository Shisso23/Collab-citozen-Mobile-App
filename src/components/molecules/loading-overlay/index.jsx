import * as React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import { Colors } from '../../../theme/Variables';
import useTheme from '../../../theme/hooks/useTheme';

const LoadingOverlay = ({ source, visible, onBackDropPress, transparent }) => {
  const { Gutters, Layout } = useTheme();
  const renderLoadingIndicator = () => {
    return <LottieView source={source} autoPlay style={styles.loader} loop />;
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onBackDropPress(false)}
        style={[
          styles.centeredView,
          Layout.alignItemsCenter,
          Layout.justifyContentCenter,
          ...[{ backgroundColor: transparent ? Colors.transparent : Colors.shadow }],
        ]}
      >
        <View style={[styles.modalView, Layout.alignItemsCenter, Gutters.largeMargin]}>
          <Text style={[styles.modalText, Gutters.regularBMargin]}>Loading...</Text>
          {renderLoadingIndicator()}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

LoadingOverlay.propTypes = {
  source: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  onBackDropPress: PropTypes.func.isRequired,
  transparent: PropTypes.bool,
};
LoadingOverlay.defaultProps = {
  transparent: false,
};

const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    marginTop: '25%',
  },
  loader: {
    height: 150,
    overflow: 'visible',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    width: 150,
  },
  modalText: {
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    elevation: 5,
    padding: 35,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default LoadingOverlay;
