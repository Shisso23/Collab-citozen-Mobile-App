import React from 'react';
import { StyleSheet } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';

const CustomInput = (props) => {
  const { Common } = useTheme();

  return (
    <>
      <TextInput
        autoCorrect={false}
        autoCompleteType="off"
        labelStyle={styles.label}
        inputStyle={[
          styles.inputStyle,
          { height: _.get(props, 'height', 80) },
          _.get(props, 'style', {}),
        ]}
        {...props}
      />
      <HelperText
        style={[Common.errorStyle]}
        type="error"
        visible={_.get(props, 'errorMessage', '')}
      >
        {_.get(props, 'errorMessage', '')}
      </HelperText>
    </>
  );
};

const styles = StyleSheet.create({
  inputStyle: { height: '100%' },
  label: {
    fontWeight: '500',
  },
});

export default CustomInput;
