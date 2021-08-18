import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const CustomInput = (props) => {
  const { Layout, Common, Gutters } = useTheme();

  return (
    <Input
      labelStyle={styles.label}
      inputContainerStyle={[
        Common.textInputWithShadow,
        Gutters.smallLPadding,
        Layout.alignItemsStart,
        { height: _.get(props, 'height', 60) },
        styles.inputContainer,
      ]}
      inputStyle={[styles.inputStyle, { height: _.get(props, 'height', 60) }]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: Colors.primary,
    borderWidth: 0.5,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputStyle: { height: '100%' },
  label: {
    fontWeight: '500',
  },
});

export default CustomInput;
