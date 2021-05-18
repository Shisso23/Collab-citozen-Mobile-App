import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import useTheme from '../../../theme/hooks/useTheme';

const LoadingComponent = () => {
  const { Colors, Layout } = useTheme();
  return (
    <View style={[Layout.fullSize, Layout.center]}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

LoadingComponent.propTypes = {};

LoadingComponent.defaultProps = {};

export default LoadingComponent;
