/* eslint-disable global-require */
import React from 'react';
import { ImageBackground, Animated, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LottieView from 'lottie-react-native';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const { width } = Dimensions.get('window');
const PaymentStatusScreen = ({ route }) => {
  const paymentStatus = _.get(route, 'params.paymentStatus', '');
  const { Layout, Images, Gutters, Common } = useTheme();
  const successAnimation = require('../../../assets/lottie-files/success-tick.json');
  const failedAnimation = require('../../../assets/lottie-files/failed.json');
  const cancelledAnimation = require('../../../assets/lottie-files/transaction-cancelled.json');

  const navigation = useNavigation();
  const handleButtonPress = () => {
    switch (paymentStatus) {
      case 'success':
        return navigation.pop(4);
      case 'failed':
        return navigation.pop(2);
      default:
        return navigation.pop(3);
    }
  };

  const renderStatusIcon = () => {
    return (
      <LottieView
        source={
          paymentStatus === 'success'
            ? successAnimation
            : paymentStatus === 'failed'
            ? failedAnimation
            : cancelledAnimation
        }
        autoPlay
        speed={0.8}
        style={styles.animatedIcon}
        loop={false}
      />
    );
  };

  return (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Layout.fill]}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            Gutters.tinyMargin,
            Gutters.regularBMargin,
            Common.viewWithShadow,
            Gutters.smallHPadding,
            styles.paymentStatussBox,
          ]}
        >
          {renderStatusIcon()}
          <Text
            style={[
              Gutters.regularVMargin,
              styles.statusText,
              {
                color:
                  (paymentStatus === 'success' && Colors.success) ||
                  (paymentStatus === 'failed' && Colors.danger) ||
                  (paymentStatus === 'cancelled' && Colors.warning),
              },
            ]}
          >
            {paymentStatus === 'success'
              ? 'success'
              : paymentStatus === 'failed'
              ? 'Error!'
              : paymentStatus === 'cancelled' && 'Cancelled'}
          </Text>
          <Text style={[Gutters.regularVMargin, styles.description]}>
            {(paymentStatus === 'success' && 'Your payment was successful!') ||
              (paymentStatus === 'failed' && 'Oops. Something went wrong with your payment.') ||
              (paymentStatus === 'cancelled' && 'You have cancelled this payment.')}
          </Text>
          <Button
            color={
              paymentStatus === 'success'
                ? Colors.success
                : paymentStatus === 'cancelled'
                ? Colors.warning
                : Colors.danger
            }
            mode="outlined"
            onPress={handleButtonPress}
            style={[Layout.alignItemsCenter, Layout.justifyContentCenter, { width: '90%' }]}
          >
            {paymentStatus === 'success'
              ? 'Continue'
              : paymentStatus === 'failed'
              ? 'Try again!'
              : 'Okay'}
          </Button>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  animatedIcon: {
    height: 150,
    overflow: 'visible',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    width: 15,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    textAlign: 'center',
  },
  paymentStatussBox: {
    backgroundColor: Colors.lightgray,
    borderColor: Colors.shadow,
    borderRadius: 11,
    elevation: 15,
    height: width / 1.001,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    width: width * 0.72,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

PaymentStatusScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

export default PaymentStatusScreen;
