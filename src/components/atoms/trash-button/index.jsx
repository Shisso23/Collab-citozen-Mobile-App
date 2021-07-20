import React from 'react';
import { StyleSheet, ActivityIndicator, ViewPropTypes, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import useTheme from '../../../theme/hooks/useTheme';

const TrashButton = ({ onPress, loading, containerStyle }) => {
  const { Colors } = useTheme();
  return !loading ? (
    <Pressable onPress={onPress} style={containerStyle}>
      <Icon
        name="trash"
        backgroundColor="transparent"
        color={Colors.gray}
        size={20}
        loading={loading}
      />
    </Pressable>
  ) : (
    <ActivityIndicator size="small" style={styles.loaderStyle} color={Colors.danger} />
  );
};

const styles = StyleSheet.create({
  loaderStyle: {
    marginRight: 0,
    marginTop: 2,
  },
});

TrashButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  containerStyle: ViewPropTypes.style,
  loading: PropTypes.bool.isRequired,
};

TrashButton.defaultProps = {
  containerStyle: {},
};

export default TrashButton;
