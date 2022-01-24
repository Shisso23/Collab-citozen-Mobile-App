import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ViewPropTypes } from 'react-native';

import Error from '../../atoms/error-message';
import Label from '../../atoms/label';
import theme from '../../../theme/react-native-elements-theme';
import { useTheme } from '../../../theme';

const InputWrapper = ({
  label,
  required,
  errorMessage,
  children,
  containerStyle,
  inputContainerStyle,
  labelStyle,
}) => {
  const { Gutters, Layout } = useTheme();
  return (
    <View style={[Layout.fullWidth, Gutters.smallHPadding, containerStyle]}>
      <Label
        required={required}
        label={label}
        labelStyle={{ ...labelStyle, ...theme.Input.labelStyle }}
      />
      <View style={[styles.inputContainerStyle, Gutters.smallVPadding, inputContainerStyle]}>
        {children}
      </View>
      <Error message={errorMessage} />
    </View>
  );
};

InputWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,
  labelStyle: PropTypes.object,
};

InputWrapper.defaultProps = {
  children: [],
  required: false,
  errorMessage: null,
  containerStyle: {},
  inputContainerStyle: {},
  labelStyle: {},
};

export default InputWrapper;

const styles = StyleSheet.create({
  inputContainerStyle: {
    fontSize: 16,
  },
});
