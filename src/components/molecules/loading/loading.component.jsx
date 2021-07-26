import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import useTheme from '../../../theme/hooks/useTheme';

const LoadingComponent = ({ style, size }) => {
  const { Colors, Layout } = useTheme();
  return (
    <View style={[Layout.fullSize, Layout.center, style]}>
      <ActivityIndicator size={size || 'large'} color={Colors.primary} />
    </View>
  );
};

LoadingComponent.propTypes = {
  style: PropTypes.object,
  size: PropTypes.string,
};

LoadingComponent.defaultProps = {
  style: {},
  size: 'large',
};

export default LoadingComponent;
