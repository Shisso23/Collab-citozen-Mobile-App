/* eslint-disable */
import React, { useState, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';

const CheckBoxTick = () => {
  const [checked, setChecked] = useState(false);

  const _updateBox = () => {
    setChecked(!checked);
    // setFormValue(true);
  };

  //   const _handleNo = () => {
  //     setYesChecked(false);
  //     setNoChecked(true);
  //     // setFormValue(false);
  //   };

  return (
    <CheckBox
      // ref={ref}
      onPress={_updateBox}
      checked={checked}
      containerStyle={styles.containerStyle}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 0,
  },
  wrapper: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

CheckBoxTick.propTypes = {
  //   setFormValue: PropTypes.func.isRequired,
};

CheckBoxTick.defaultProps = {};

export default CheckBoxTick;
