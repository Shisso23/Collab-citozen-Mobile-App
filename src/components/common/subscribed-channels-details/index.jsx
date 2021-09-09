import _ from 'lodash';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { List } from 'react-native-paper';

import { flashService } from '../../../services';
import SubscriptionSetting from '../../molecules/subscription-setting/subscription-setting.component';
import useTheme from '../../../theme/hooks/useTheme';

const SubscribedToChannelsDetails = (props) => {
  const { Gutters, Fonts, Colors, Common } = useTheme();
  const { channel } = props;
  const channelItem = _.get(channel, 'channelItem');
  const channelId = channelItem.objId;
  const interestTypes = channelItem.interest_types;

  useEffect(() => {
    if (_.get(channelItem, 'interest_types', []).length === 0) {
      flashService.error('There are currently no Interest Types');
    }
  }, []);

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
    </View>
  );
};

SubscribedToChannelsDetails.propTypes = {
  channel: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
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
