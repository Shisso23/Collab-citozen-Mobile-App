import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
import { List } from 'react-native-paper';

import SubscriptionSetting from '../../molecules/subscription-setting/subscription-setting.component';
import useTheme from '../../../theme/hooks/useTheme';

const SubscribedToChannelsDetails = (props) => {
  const { Gutters, Fonts, Colors, Common } = useTheme();
  const { channel } = props;
  const channelItem = _.get(channel, 'channelItem');
  const channelId = channelItem.objId;
  const interestTypes = channelItem.interest_types;

  const subscribeToItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
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

SubscribedToChannelsDetails.defaultProps = {};

export default SubscribedToChannelsDetails;
