import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Icon } from 'react-native-elements';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const ContactButton = (props) => {
  const { iconName, iconType, iconColor, contact, onPress } = props;
  const { Layout, Common, Fonts, Gutters } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[Layout.rowHCenter, Gutters.smallPadding, Gutters.smallMargin, styles.buttonStyle]}
    >
      <Icon
        contact={contact}
        name={iconName}
        type={iconType}
        color={iconColor}
        style={Gutters.smallRMargin}
      />
      <Text style={[Fonts.textRegular, Common.cardDescription, { color: Colors.darkgray }]}>
        {contact}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.shadow,
    borderRadius: 15,
    overflow: 'hidden',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
});

ContactButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  iconType: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

ContactButton.defaultProps = {};

export default ContactButton;
