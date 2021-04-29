import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { HelperText, Menu, TextInput, List } from 'react-native-paper';
import { Dimensions } from 'react-native';
import useTheme from '../../../theme/hooks/useTheme';

const { width } = Dimensions.get('window');

const DropdownSelect = ({
  items,
  value,
  onChange,
  keyExtractor,
  valueExtractor,
  error,
  placeholder,
  errorStyle,
  disabled,
  label,
  onBlur,
}) => {
  const [visible, setVisible] = React.useState(false);
  const textRef = useRef(null);
  const hide = () => {
    setVisible(false);
    textRef.current.blur();
    onBlur();
  };
  const show = () => setVisible(true);
  const { Common, Colors } = useTheme();

  const _handleChange = (newItem) => {
    hide();
    onChange(newItem);
  };

  return (
    <Menu
      visible={visible}
      onDismiss={hide}
      anchor={
        <>
          <TextInput
            label={value || visible ? label : placeholder}
            ref={textRef}
            style={[Common.textInput]}
            onChangeText={() => null}
            editable={disabled}
            value={value}
            placeholder={placeholder}
            showSoftInputOnFocus={false}
            onFocus={show}
            error={!!error}
            multiline
            right={
              <TextInput.Icon
                name="chevron-down"
                disabled={disabled}
                color={Colors.primary}
                size={25}
                onPress={show}
                autoFocus={false}
              />
            }
          />
          <HelperText style={errorStyle} type="error" visible={!!error}>
            {error}
          </HelperText>
        </>
      }
    >
      {items?.map((item, index) => (
        <List.Item
          key={keyExtractor(item, index)}
          onPress={() => _handleChange(item, index)}
          title={valueExtractor(item, index)}
          style={{ width: width * 0.8 }}
          titleNumberOfLines={5}
        />
      ))}
    </Menu>
  );
};

DropdownSelect.propTypes = {
  items: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  keyExtractor: PropTypes.func,
  valueExtractor: PropTypes.func,
  error: PropTypes.string,
  errorStyle: PropTypes.any,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
};

DropdownSelect.defaultProps = {
  items: [],
  onChange: () => {},
  keyExtractor: (item) => item.id,
  valueExtractor: (item) => item.label,
  error: null,
  errorStyle: {},
  placeholder: '',
  value: '',
  label: '',
  disabled: false,
  onBlur: () => {},
};

export default DropdownSelect;
