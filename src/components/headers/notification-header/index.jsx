import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getUnOpenedNotificationsAction } from '../../../reducers/notification-reducer/notification.actions';
import { Colors } from '../../../theme/Variables';

const NotificationHeader = ({ style }) => {
  const navigation = useNavigation();
  const { unOpenedNotifications } = useSelector((reducers) => reducers.notificationReducer);
  const count = _.get(unOpenedNotifications, 'Count', []);
  const [countUnOpenedNotifications, setCountUnOpenedNotifications] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUnOpenedNotificationsAction());
    setCountUnOpenedNotifications(getNotificationsCount());
  }, [countUnOpenedNotifications]);

  const getNotificationsCount = () =>
    count.reduce((totalNotifications, notification) => {
      totalNotifications += _.get(notification, 'unopened_notifications_count', 0);
      return totalNotifications;
    }, 0);

  return (
    <>
      <TouchableOpacity style={style} onPress={() => navigation.navigate('Inbox')}>
        <Icon
          type="font-awesome-5"
          name="bell"
          size={23}
          color={Colors.white}
          containerStyle={styles.iconContainerStyle}
        />

        {countUnOpenedNotifications > 0 && (
          <Badge
            containerStyle={styles.badgeContainerStyle}
            value={`${countUnOpenedNotifications}`}
          />
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  badgeContainerStyle: {
    position: 'absolute',
    right: 12,
    top: -6,
  },
  iconContainerStyle: {
    marginRight: 15,
  },
});

NotificationHeader.propTypes = {
  style: PropTypes.object,
};

NotificationHeader.defaultProps = {
  style: {},
};

export default NotificationHeader;
