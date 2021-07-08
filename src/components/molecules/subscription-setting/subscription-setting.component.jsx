import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { updateUserSubscriptionAction } from '../../../reducers/subscribe-to-channels-reducer/subscribe-to-channel.actions';
import { getMyChannelsAction } from '../../../reducers/my-channels/my-channels.actions';

const SubscriptionSetting = (props) => {
  const { itemSelected, setItem, subscribingScreen, switchToggle, channelId } = props;
  const [hasEnabledSetting, setHasEnabledSettings] = useState(switchToggle);
  const { user } = useSelector((reducers) => reducers.userReducer);
  const dispatch = useDispatch();

  function toggleSwitch(value) {
    if (value) {
      setHasEnabledSettings(true);
      if (subscribingScreen) {
        setItem({ itemSelected, present: !hasEnabledSetting });
      } else {
        onSubscribeFromChannel();
      }
    } else {
      setHasEnabledSettings(false);
      if (subscribingScreen) {
        setItem({ itemSelected, present: !hasEnabledSetting });
      } else {
        onUnsubscribeFromChannel();
      }
    }
  }

  const onSubscribeFromChannel = async () => {
    await dispatch(updateUserSubscriptionAction(user, itemSelected, channelId, 'T'));
    dispatch(getMyChannelsAction());
  };

  const onUnsubscribeFromChannel = async () => {
    await dispatch(updateUserSubscriptionAction(user, itemSelected, channelId, 'F'));
    dispatch(getMyChannelsAction());
  };

  return (
    <View style={styles.settingsContainer}>
      <Switch onValueChange={toggleSwitch} value={hasEnabledSetting} />
    </View>
  );
};

export default SubscriptionSetting;

SubscriptionSetting.propTypes = {
  itemSelected: PropTypes.object,
  setItem: PropTypes.func,
  subscribingScreen: PropTypes.bool.isRequired,
  switchToggle: PropTypes.bool.isRequired,
  channelId: PropTypes.number,
};

SubscriptionSetting.defaultProps = {
  setItem: () => null,
  itemSelected: {},
  channelId: 0,
};

const styles = StyleSheet.create({
  settingsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
