import React from 'react';
import { StyleSheet, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '../../../theme/Variables';
import theme from '../../../theme/react-native-elements-theme';

const Label = ({ label, required, labelStyle, requiredStyle }) => {
  if (!label) {
    return null;
  }

  return (
    <Text style={[styles.labelStyle, theme.Input.labelStyle, labelStyle]}>
      {label}
      &nbsp;
      {required && <Text style={[styles.requiredStyle, requiredStyle]}>*</Text>}
    </Text>
  );
};

Label.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,

  requiredStyle: ViewPropTypes.style,
  labelStyle: PropTypes.object,
};

Label.defaultProps = {
  required: false,
  requiredStyle: {},
  labelStyle: {},
};

export default Label;

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requiredStyle: {
    color: Colors.error,
  },
});
