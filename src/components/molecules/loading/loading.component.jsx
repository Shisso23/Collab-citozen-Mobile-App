import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import useTheme from '../../../theme/hooks/useTheme';

const LoadingComponent = () => {
  const { Colors } = useTheme();
  return (
    <View style={[styles.container]}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

LoadingComponent.propTypes = {};

LoadingComponent.defaultProps = {};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 3,
    justifyContent: 'center',
    marginBottom: 100,
  },
});

export default LoadingComponent;
