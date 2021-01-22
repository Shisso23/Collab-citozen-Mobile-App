import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';

const ScreenContainer = ({ children }) => {
  return <ScrollView>{children}</ScrollView>;
};

ScreenContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScreenContainer;
