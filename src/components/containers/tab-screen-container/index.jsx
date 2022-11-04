import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../../theme';

const tabBarHeight = 65;
const TabScreenContainer = ({ children, style }) => {
  const { Layout } = useTheme();
  return (
    <>
      <View style={[styles.container, Layout.fill, style]}>{children}</View>
    </>
  );
};

export default TabScreenContainer;

TabScreenContainer.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.oneOf([PropTypes.object, PropTypes.array]),
};

TabScreenContainer.defaultProps = {
  style: {},
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginBottom: tabBarHeight * 2,
  },
});
