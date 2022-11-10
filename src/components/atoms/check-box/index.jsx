import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';

const CheckBoxTick = (props) => {
  const { selectedItem, setItem, onPress } = props;
  const [checked, setChecked] = useState(false);

  const _updateBox = () => {
    setChecked(!checked);
    onPress();
    setItem({ selectedItem, present: !checked });
  };

  return (
    <CheckBox
      onPress={_updateBox}
      checked={checked}
      containerStyle={styles.containerStyle}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 0,
  },
});

CheckBoxTick.propTypes = {
  selectedItem: PropTypes.object,
  setItem: PropTypes.func,
  onPress: PropTypes.func,
};

CheckBoxTick.defaultProps = {
  selectedItem: null,
  onPress: () => {},
  setItem: () => {},
};

export default CheckBoxTick;
