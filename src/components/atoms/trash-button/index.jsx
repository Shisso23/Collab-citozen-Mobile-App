import React from 'react';
import { StyleSheet, ActivityIndicator, ViewPropTypes, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import useTheme from '../../../theme/hooks/useTheme';

const TrashButton = ({ onPress, loading, iconSize, containerStyle }) => {
  const { Colors } = useTheme();
  return !loading ? (
    <Pressable onPress={onPress} style={containerStyle}>
      <Icon
        name="trash"
        backgroundColor="transparent"
        color={Colors.gray}
        size={iconSize || 20}
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
  loading: PropTypes.bool,
  iconSize: PropTypes.number,
};

TrashButton.defaultProps = {
  containerStyle: {},
  iconSize: 20,
  loading: false,
};

export default TrashButton;
