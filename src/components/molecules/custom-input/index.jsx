import React from 'react';
import { StyleSheet } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';

const CustomInput = (props) => {
  const { Common } = useTheme();
  const { warningText } = props;
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
        style={warningText ? Common.warningStyle : Common.errorStyle}
        type="error"
        visible={_.get(props, 'errorMessage', false) || warningText}
      >
        {warningText || _.get(props, 'errorMessage', '')}
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

CustomInput.propTypes = {
  warningText: PropTypes.any,
};
CustomInput.defaultProps = {
  warningText: null,
};
export default CustomInput;
