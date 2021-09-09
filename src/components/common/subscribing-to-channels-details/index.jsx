import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { Button, List } from 'react-native-paper';

import { getMyChannelsAction } from '../../../reducers/my-channels/my-channels.actions';
import { getUnOpenedNotificationsAction } from '../../../reducers/notification-reducer/notification.actions';
import { flashService } from '../../../services';
import { subscribeToChannelsAction } from '../../../reducers/subscribe-to-channels-reducer/subscribe-to-channel.actions';
import SubscriptionSetting from '../../molecules/subscription-setting/subscription-setting.component';
import useTheme from '../../../theme/hooks/useTheme';

const SubscribingToChannelsDetails = (props) => {
  const { Gutters, Fonts, Colors, Common, Layout } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { user } = useSelector((reducers) => reducers.userReducer);
  const [isLoading, setIsLoading] = useState(false);

  const interestTypeList = [];
  const unSubscribeList = [];

  const { channel } = props;
  const channelItem = _.get(channel, 'channelItem');

  const municipalitiyId = channelItem.ObjId;
  const interestTypes = channelItem.interest_type;

  useEffect(() => {
    if (_.get(channelItem, 'interest_type', []).length === 0) {
      flashService.error('There are currently no Interest Types');
    }
  }, []);

  const updateInterestTypeList = (itemPass) => {
    if (itemPass.present && !itemPass.itemSelected.Subscribed) {
      interestTypeList.push(itemPass.itemSelected);
    } else if (itemPass.itemSelected.Subscribed && !itemPass.present) {
      unSubscribeList.push(itemPass.itemSelected);
    } else if (itemPass.itemSelected.Subscribed && itemPass.present) {
      unSubscribeList.splice(unSubscribeList.indexOf(itemPass.itemSelected), 1);
    } else if (!itemPass.present) {
      interestTypeList.splice(interestTypeList.indexOf(itemPass.itemSelected), 1);
    }
  };

  const handleSub = async () => {
    if (!_.isEmpty(unSubscribeList)) {
      interestTypeList.push(...unSubscribeList);
    }

    if (_.isEmpty(interestTypeList)) {
      flashService.error('No Interest Types Updated');
    } else {
      setIsLoading(true);
      await dispatch(subscribeToChannelsAction(municipalitiyId, interestTypeList, user));
      setIsLoading(false);
      dispatch(getMyChannelsAction());
      dispatch(getUnOpenedNotificationsAction());
      navigation.navigate('ViewSubscribeToChannels');
      flashService.success('Successfully Subscribed To Channel');
    }
  };

  const subscribeToItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin, styles.typeItem]}>
        <List.Item
          title={item.name}
          right={() => (
            <SubscriptionSetting
              itemSelected={item}
              setItem={updateInterestTypeList}
              subscribingScreen
              switchToggle={item.Subscribed}
            />
          )}
          titleStyle={Common.cardTitle}
        />
      </View>
    );
  };

  return (
    <View style={[Gutters.regularHMargin, Layout.fill]}>
      <Text style={[Fonts.titleRegular, Gutters.regularHMargin]}>{`${channelItem.name}`}</Text>
      <Divider color={Colors.transparent} />
      <Text style={[Fonts.titleTiny, Gutters.regularHMargin]}>Interest Types:</Text>
      <Divider color={Colors.transparent} />
      <FlatList
        data={interestTypes}
        renderItem={subscribeToItem}
        keyExtractor={(item) => String(item.obj_id)}
      />
      <Divider color={Colors.transparent} />
      <View style={Common.bottomButtonChannelDetails}>
        <Button mode="contained" onPress={handleSub} loading={isLoading} disabled={isLoading}>
          Submit
        </Button>
      </View>
    </View>
  );
};

SubscribingToChannelsDetails.propTypes = {
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

SubscribingToChannelsDetails.defaultProps = {};

export default SubscribingToChannelsDetails;
