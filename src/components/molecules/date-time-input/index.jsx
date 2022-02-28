import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button } from 'react-native-elements';

import theme from '../../../theme/react-native-elements-theme';
import InputWrapper from '../input-wrapper';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const DateTimeInput = ({
  value,
  errorMessage,
  label,
  format = 'YYYY-MM-DD',
  mode = 'date',
  onChange,
}) => {
  const { Layout, Custom, Gutters } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  const getValue = () => {
    const date = moment(value);

    return date.format(format);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const onValueChange = (newValue) => {
    if (onChange) {
      toggleModal();
      onChange(getStringValue(newValue));
    }
  };

  const getStringValue = (newValue) => {
    const date = moment(newValue);

    return date.format(format);
  };

  const getDateValue = () => {
    let date;
    if (_.isNil(value) || _.isEmpty(value)) {
      date = new Date();
    }

    return moment(date).date();
  };

  return (
    <>
      <InputWrapper
        label={label}
        errorMessage={errorMessage}
        labelStyle={styles.labelStyle}
        containerStyle={theme.Input.containerStyle}
      >
        <Button
          onPress={toggleModal}
          title={getValue()}
          buttonStyle={[
            theme.Input.inputStyle,
            Layout.alignItemsStart,
            Custom.noPaddingLeft,
            styles.buttonStyle,
          ]}
          containerStyle={[theme.Input.inputContainerStyle, Gutters.largeHMargin]}
          titleStyle={[Custom.buttonTextInput, theme.Input.inputStyle]}
        />
      </InputWrapper>

      <DateTimePickerModal
        minimumDate={moment(new Date(Date.now())).subtract(3, 'months').toDate()}
        maximumDate={new Date(Date.now())}
        isVisible={modalOpen}
        date={getDateValue()}
        mode={mode}
        is24Hour
        display="default"
        onConfirm={onValueChange}
        onCancel={toggleModal}
      />
    </>
  );
};

export default DateTimeInput;

const styles = StyleSheet.create({
  buttonStyle: { backgroundColor: Colors.softBlue },
  labelStyle: {
    color: Colors.darkgray,
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 28,
    marginTop: 30,
  },
});

DateTimeInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  format: PropTypes.string,
  mode: PropTypes.string,

  onChange: PropTypes.func.isRequired,
};

DateTimeInput.defaultProps = {
  value: moment(new Date()).format('YYYY-MM-DD HH:mm'),
  errorMessage: '',
  mode: 'date',
  format: 'YYYY-MM-DD',
};
