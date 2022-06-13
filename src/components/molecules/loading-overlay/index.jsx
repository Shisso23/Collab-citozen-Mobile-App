import * as React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import { Colors } from '../../../theme/Variables';

const LoadingOverlay = ({ source }) => {
  const renderLoadingIndicator = () => {
    return <LottieView source={source} autoPlay loop />;
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent visible>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Lading Map...</Text>
            {renderLoadingIndicator()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

LoadingOverlay.propTypes = {
  source: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  centeredView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    elevation: 5,
    margin: 20,
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
