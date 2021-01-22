import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const FormScreenContainer = ({ children }) => {
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      {children}
    </KeyboardAwareScrollView>
  );
};

FormScreenContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormScreenContainer;
