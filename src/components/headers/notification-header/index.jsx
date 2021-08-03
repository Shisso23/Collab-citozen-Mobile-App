import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { getUnOpenedNotificationsAction } from '../../../reducers/notification-reducer/notification.actions';
import { Colors } from '../../../theme/Variables';

const NotificationHeader = ({ style }) => {
  const navigation = useNavigation();
  const { unOpenedNotifications } = useSelector((reducers) => reducers.notificationReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUnOpenedNotificationsAction());
  }, []);

  useEffect(() => {
    dispatch(getUnOpenedNotificationsAction());
  }, [unOpenedNotifications]);

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

        {unOpenedNotifications > 0 && (
          <Badge containerStyle={styles.badgeContainerStyle} value={`${unOpenedNotifications}`} />
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
