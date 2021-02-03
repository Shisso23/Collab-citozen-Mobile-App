import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { exitAppOnHardwarePressListener } from '../../../helpers';

const { CancelToken } = axios;

const HomeScreen = () => {
  const requestSource = CancelToken.source();
  useFocusEffect(exitAppOnHardwarePressListener);

  useEffect(() => {
    return () => {
      requestSource.cancel();
    };
  }, []);

  return (
    <View>
      <Text>HOME</Text>
    </View>
  );
};

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};

export default HomeScreen;
