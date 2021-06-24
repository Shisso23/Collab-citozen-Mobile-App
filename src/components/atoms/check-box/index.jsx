import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

const CheckBoxTick = () => {
  const [checked, setChecked] = useState(false);

  const _updateBox = () => {
    setChecked(!checked);
  };

  return <CheckBox onPress={_updateBox} checked={checked} containerStyle={styles.containerStyle} />;
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 0,
  },
});

CheckBoxTick.propTypes = {};

CheckBoxTick.defaultProps = {};

export default CheckBoxTick;
