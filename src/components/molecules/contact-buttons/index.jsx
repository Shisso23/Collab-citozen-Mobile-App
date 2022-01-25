import React from 'react';
import { View, Linking, Platform } from 'react-native';
import PropTypes from 'prop-types';
import useTheme from '../../../theme/hooks/useTheme';
import ContactButton from '../../atoms/contact-button';
import { flashService } from '../../../services';

const ContactButtons = (props) => {
  const { contact } = props;
  const { Colors } = useTheme();
  const defaultMessage = 'Hi';

  const handleLinkingFail = () => {
    return flashService.error('Could not complete the operation!');
  };

  const handleLinkingResponse = (link) => {
    Linking.openURL(link)
      .then((supported) => {
        if (!supported) {
          return flashService.error('Operation is not supported!');
        }
        return Linking.openURL(link);
      })
      .catch(handleLinkingFail);
  };

  const handleContactAction = (action) => () => {
    let link;
    const separator = Platform.OS === 'ios' ? '&' : '?';
    switch (action) {
      case 'call':
        link = `tel://${contact.number.replace(/\s/g, '')}`;
        break;
      case 'whatsapp':
        link = `whatsapp://send?text=${defaultMessage}&phone=+27${contact.whatsapp
          .replace(/\s/g, '')
          .substring(1)}`;
        break;
      case 'sms':
        link = `sms:${contact.sms.replace(/\s/g, '')}${separator}body=${defaultMessage}`;
        break;
      case 'twitter':
        link = `https://twitter.com/${contact.twitter.toLowerCase()}`;
        break;
      case 'facebook':
        link = `https://www.facebook.com/${contact.facebook}`;
        break;
      case 'email':
        link = `mailto:${contact.email}?subject='Inquiry'&body=${defaultMessage}`;
        break;
      default:
        link = `tel://${contact.number.replace(/\s/g, '')}`;
    }
    handleLinkingResponse(link);
  };

  return (
    <View>
      {contact.number !== '' && (
        <ContactButton
          contact={contact.number}
          iconName="phone"
          iconType="font-awesome"
          iconColor="#2B9B4D"
          onPress={handleContactAction('call')}
        />
      )}
      {contact.whatsapp !== '' && (
        <ContactButton
          contact={contact.whatsapp}
          iconName="whatsapp"
          iconType="font-awesome"
          iconColor="#2B9B4D"
          onPress={handleContactAction('whatsapp')}
        />
      )}
      {contact.facebook !== '' && (
        <ContactButton
          contact={contact.facebook}
          iconName="facebook"
          iconType="font-awesome"
          iconColor="#1A58AC"
          onPress={handleContactAction('facebook')}
        />
      )}
      {contact.twitter !== '' && (
        <ContactButton
          contact={contact.twitter}
          iconName="twitter"
          iconType="font-awesome"
          iconColor="#69D1F0"
          onPress={handleContactAction('twitter')}
        />
      )}
      {contact.email !== '' && (
        <ContactButton
          contact={contact.email}
          iconName="email-outline"
          iconType="material-community"
          iconColor={Colors.black}
          onPress={handleContactAction('email')}
        />
      )}
      {contact.sms !== '' && (
        <ContactButton
          contact={contact.sms}
          iconName="sms"
          iconType="material"
          iconColor={Colors.black}
          onPress={handleContactAction('sms')}
        />
      )}
    </View>
  );
};

ContactButtons.propTypes = {
  contact: PropTypes.object.isRequired,
};

ContactButtons.defaultProps = {};

export default ContactButtons;
