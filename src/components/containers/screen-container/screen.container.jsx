import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, ScrollView } from 'react-native';

const ScreenContainer = ({ children }) => {
  const screenHeight = Dimensions.get('window').height;
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: screenHeight - screenHeight * 0.8 }}>
      {children}
    </ScrollView>
  );
};

ScreenContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScreenContainer;
