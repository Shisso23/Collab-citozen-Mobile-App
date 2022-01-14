import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

import { useTheme } from '../../../theme';
import SocialIcon from '../../atoms/social-icon';

const ContactsActionSheetContent = ({ handleContactAction }) => {
  const { Gutters, Layout, Images } = useTheme();

  return (
    <View
      source={Images.serviceRequest}
      style={[Gutters.regularBPadding, Layout.alignItemsCenter]}
      resizeMode="cover"
    >
      <Text h4 style={Gutters.smallBMargin}>
        Contact via:
      </Text>
      <View style={[Layout.rowBetween, Gutters.largeBPadding, styles.iconsContainer]}>
        <SocialIcon iconName="phone" label="Phone" onPress={() => handleContactAction('call')} />
        <SocialIcon
          iconName="whatsapp"
          label="Whatsapp"
          onPress={() => handleContactAction('whatsapp')}
        />
        <SocialIcon
          iconName="sms"
          label="SMS"
          type="material-icons"
          onPress={() => handleContactAction('sms')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconsContainer: {
    width: '70%',
  },
});

ContactsActionSheetContent.propTypes = {
  handleContactAction: PropTypes.func.isRequired,
};
export default ContactsActionSheetContent;
