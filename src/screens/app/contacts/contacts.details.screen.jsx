import React from 'react';
import { List } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { FlatList, Text, View, ImageBackground, Linking, Alert } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const ContactDetailsScreen = ({ route }) => {
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();
  const { params } = route;
  const { contactDetails } = params;

  const onCall = (item) => {
    Linking.openURL(`tel://${item.number}`)
      .then((supported) => {
        if (!supported) {
          return Alert.alert('Phone number is not available');
        }
        return Linking.openURL(item.number);
      })
      .catch((error) => console.warn(_.get(error, 'message', 'Failed to open!')));
  };

  const renderContactDetails = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.name}
          titleStyle={Common.cardTitle}
          onPress={() => {
            Alert.alert(
              `Call for ${item.name} ?`,
              '',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Call',
                  onPress: () => onCall(item),
                },
              ],
              { cancelable: false },
            );
          }}
          description={() => (
            <View style={[Layout.column, Gutters.largeRMargin]}>
              <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                <Icon
                  name="phone"
                  type="font-awesome"
                  color={Colors.primary}
                  style={Gutters.smallRMargin}
                />
                <Text style={[Fonts.textRegular, Common.cardDescription]}>{item.number}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Contact details</Text>
        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={contactDetails}
          renderItem={renderContactDetails}
          keyExtractor={(item) => String(item.number)}
        />
      </ImageBackground>
    </>
  );
};

ContactDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

ContactDetailsScreen.defaultProps = {};

export default ContactDetailsScreen;
