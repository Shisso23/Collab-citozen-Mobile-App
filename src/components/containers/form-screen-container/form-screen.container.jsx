import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ViewPropTypes } from 'react-native';

const FormScreenContainer = ({ children, contentContainerStyle }) => {
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

FormScreenContainer.propTypes = {
  children: PropTypes.node.isRequired,
  contentContainerStyle: ViewPropTypes.style,
};
FormScreenContainer.defaultProps = {
  contentContainerStyle: {},
};
export default FormScreenContainer;
