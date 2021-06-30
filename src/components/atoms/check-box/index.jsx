import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';

const CheckBoxTick = (props) => {
  const { selectedItem, setItem } = props;
  const [checked, setChecked] = useState(false);

  const _updateBox = () => {
    setChecked(!checked);
    if (!checked) {
      setItem({ selectedItem, present: true });
    } else if (checked) {
      setItem({ selectedItem, present: false });
    }
  };

  return <CheckBox onPress={_updateBox} checked={checked} containerStyle={styles.containerStyle} />;
};

const styles = StyleSheet.create({
  containerStyle: {
    padding: 0,
  },
});

CheckBoxTick.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  setItem: PropTypes.func.isRequired,
};

CheckBoxTick.defaultProps = {};

export default CheckBoxTick;
