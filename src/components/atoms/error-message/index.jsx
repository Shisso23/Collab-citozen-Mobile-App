import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import theme from '../../../theme/react-native-elements-theme';

const Error = ({ message }) => {
  if (!message) {
    return null;
  }

  return <Text style={[theme.Input.errorStyle]}>{message}</Text>;
};

Error.propTypes = {
  message: PropTypes.string,
};

Error.defaultProps = {
  message: null,
};

export default Error;
