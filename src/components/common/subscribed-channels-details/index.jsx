import _ from 'lodash';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Divider, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { List } from 'react-native-paper';

import { flashService } from '../../../services';
import SubscriptionSetting from '../../molecules/subscription-setting/subscription-setting.component';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const SubscribedToChannelsDetails = (props) => {
  const { Gutters, Fonts, Common } = useTheme();
  const { channel } = props;
  const channelItem = _.get(channel, 'channelItem');
  const channelId = channelItem.objId;
  const interestTypes = channelItem.interest_types;
  const navigation = useNavigation();

  useEffect(() => {
    if (_.get(channelItem, 'interest_types', []).length === 0) {
      flashService.error('There are currently no Interest Types');
    }
  }, []);

  const onCreateNotificationPressed = (_interestTypes) => () => {
    navigation.navigate('CreateNotification', { _interestTypes });
  };

  const subscribeToItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin, styles.typeItem]}>
        <List.Item
          title={item.name}
          right={() => (
            <SubscriptionSetting
              itemSelected={item}
              subscribingScreen={false}
              switchToggle={item.Subscribed}
              channelId={channelId}
            />
          )}
          titleStyle={Common.cardTitle}
        />
      </View>
    );
  };

  return (
    <View style={Gutters.regularHMargin}>
      <Text style={[Fonts.titleRegular, Gutters.regularHMargin]}>{`${channelItem.name}`}</Text>
      <Divider color={Colors.transparent} />
      <Text style={[Fonts.titleTiny, Gutters.regularHMargin]}>Interest Types:</Text>
      <Divider color={Colors.transparent} />
      <FlatList
        data={interestTypes}
        renderItem={subscribeToItem}
        keyExtractor={(item) => String(item.obj_id)}
      />
      {(channelItem.userCanCreateNotification && (
        <Button
          style={styles.newNotificationButton}
          type="outline"
          title="New Notification"
          titleStyle={Gutters.smallMarginHorizontal}
          buttonStyle={[...[{ borderBottomWidth: 0 }]]}
          containerStyle={[Gutters.smallVMargin, Gutters.tinyHMargin, styles.buttonContainer]}
          onPress={onCreateNotificationPressed(interestTypes)}
        />
      )) || <></>}
    </View>
  );
};

SubscribedToChannelsDetails.propTypes = {
  channel: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderColor: Colors.primary,
    borderRadius: 10,
    borderWidth: 1,
  },
  newNotificationButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  typeItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.16,
  },
});
SubscribedToChannelsDetails.defaultProps = {};

export default SubscribedToChannelsDetails;
