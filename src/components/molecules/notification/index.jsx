import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Text } from 'react-native-elements';
import { Avatar, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {
  openNotificationAction,
  getUnOpenedNotificationsAction,
  deleteNotificationAction,
  previewDeleNotificationAction,
} from '../../../reducers/notification-reducer/notification.actions';
import { TrashButton } from '../../atoms';
import { promptConfirm } from '../../../helpers/prompt.helper';
import useTheme from '../../../theme/hooks/useTheme';
import SwipeRowContainer from '../../atoms/swipe-row/swipe-row';
import { Colors } from '../../../theme/Variables';

const Notification = ({
  notification,
  index,
  multiSelectEnabled,
  onPress,
  onLongPress,
  isSelected,
  expanded,
  handleDeleteNotification,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((reducers) => reducers.userReducer);
  const { deleteNotificationPreview } = useSelector((reducers) => reducers.notificationReducer);
  const notificationId = _.get(notification, 'obj_id');
  const datePublished = _.get(notification, 'date_published', new Date());
  const title = _.get(notification, 'title', '');
  const body = _.get(notification, 'body', '');
  const seen = _.get(notification, 'seen', false) === 'Yes';
  const channelName = _.get(notification, 'channel_name', '');

  const { Layout, Images, Gutters } = useTheme();
  const [isSeen, setIsSeen] = useState(seen);

  const _handleCollapse = () => {
    if (!isSeen && !multiSelectEnabled) {
      const seenAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
      dispatch(openNotificationAction(notificationId, seenAt, _.get(user, 'user_id', '')));
      dispatch(getUnOpenedNotificationsAction());
      setIsSeen(true);
      onPress();
    } else {
      onPress();
    }
  };

  const formatDate = (date) => {
    return Moment(date).fromNow();
  };

  const _handleDelete = () => {
    const deletedAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
    promptConfirm('Are you sure?', 'Are you sure you want to delete this item?', 'Delete', () => {
      handleDeleteNotification();
      dispatch(deleteNotificationAction(notificationId, deletedAt, _.get(user, 'user_id', '')));
    });
  };

  const _setImageUrl = (image) => {
    return !image ? null : image;
  };

  const renderHiddenComponent = () => <TrashButton onPress={_handleDelete} iconSize={27} />;

  const renderVisibleComponent = () => {
    const accordionStyle = {
      borderColor: Colors.lightgray,
      borderTopWidth: 1,
      backgroundColor: Colors.white,
      width: '100%',
    };
    return (
      <View style={styles.accordionContainer}>
        <List.Accordion
          title={`${title}`}
          titleNumberOfLines={3}
          description={
            <View>
              <Text style={[Gutters.tinyTMargin, styles.channelName]}>{channelName}</Text>
              <Text>{formatDate(datePublished)}</Text>
            </View>
          }
          left={() => (
            <View style={[Layout.justifyContentCenter]}>
              <Avatar.Image
                rounded
                size={35}
                style={{ backgroundColor: isSelected ? Colors.secondary : Colors.transparent }}
                source={isSelected ? null : _setImageUrl(Images.avatarImage)}
              />
            </View>
          )}
          right={() =>
            !isSeen && (
              <Badge
                status="error"
                badgeStyle={[{ backgroundColor: Colors.primary }, styles.badge]}
              />
            )
          }
          expanded={expanded}
          onPress={_handleCollapse}
          onLongPress={onLongPress}
          style={[Gutters.smallBMargin, accordionStyle]}
        >
          <Text style={[Gutters.largeRPadding, styles.notificationBody]}>{body}</Text>
        </List.Accordion>
      </View>
    );
  };

  return (
    <SwipeRowContainer
      preview={deleteNotificationPreview && index === 0}
      key={_.get(notification, 'obj_id', '')}
      swipeKey={`${_.get(notification, 'obj_id', '')}`}
      onPreviewEnd={() => {
        dispatch(previewDeleNotificationAction(false));
      }}
      renderHiddenComponent={renderHiddenComponent}
      renderVisibleComponent={renderVisibleComponent}
    />
  );
};

const styles = StyleSheet.create({
  accordionContainer: { backgroundColor: Colors.white },
  badge: {
    borderRadius: 50,
    height: 14,
    width: 14,
  },
  channelName: { color: Colors.primary },
  notificationBody: { lineHeight: 23, textAlign: 'left' },
});

Notification.propTypes = {
  notification: PropTypes.object,
  index: PropTypes.number.isRequired,
  multiSelectEnabled: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  handleDeleteNotification: PropTypes.func.isRequired,
};

Notification.defaultProps = {
  notification: {},
};

export default Notification;
