import React, { useEffect, useState } from 'react';
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

const Notification = ({
  notification,
  index,
  selectedCounter,
  setSelectedCounter,
  multiDeleteConfirmed,
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

  const { Layout, Images, Colors, Gutters } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSeen, setIsSeen] = useState(seen);
  const [isDeleting, setDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [shortPressSelectEnabled, setShortPressSelectedEnabled] = useState(false);

  const _handleCollapse = () => {
    if (shortPressSelectEnabled && !isSelected) {
      notificationSelected();
    } else if (shortPressSelectEnabled && isSelected) {
      notificationUnselected();
    } else {
      if (!isSeen) {
        const seenAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
        dispatch(openNotificationAction(notificationId, seenAt, _.get(user, 'user_id', '')));
        dispatch(getUnOpenedNotificationsAction());
        setIsSeen(true);
      }
      setIsCollapsed(!isCollapsed);
    }
  };

  const formatDate = (date) => {
    return Moment(date).fromNow();
  };

  const _handleDelete = () => {
    const deletedAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
    if (multiDeleteConfirmed) {
      setIsDeleted(true);
      setDeleting(true);
      const seenAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
      dispatch(openNotificationAction(notificationId, seenAt, _.get(user, 'user_id', '')));
      dispatch(getUnOpenedNotificationsAction());
      dispatch(deleteNotificationAction(notificationId, deletedAt, _.get(user, 'user_id', '')));
    } else {
      promptConfirm('Are you sure?', 'Are you sure you want to delete this item?', 'Delete', () => {
        setIsDeleted(true);
        setDeleting(true);
        const seenAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
        dispatch(openNotificationAction(notificationId, seenAt, _.get(user, 'user_id', '')));
        dispatch(getUnOpenedNotificationsAction());
        dispatch(deleteNotificationAction(notificationId, deletedAt, _.get(user, 'user_id', '')));
      });
    }
  };

  useEffect(() => {
    if (multiDeleteConfirmed && isSelected) {
      _handleDelete();
    }
  }, [multiDeleteConfirmed]);

  useEffect(() => {
    if (selectedCounter > 0) {
      setShortPressSelectedEnabled(true);
    } else {
      setShortPressSelectedEnabled(false);
    }
  }, [selectedCounter]);

  const _setImageUrl = (image) => {
    return !image ? null : image;
  };

  const renderHiddenComponent = () => (
    <TrashButton onPress={_handleDelete} iconSize={27} loading={isDeleting} />
  );

  const notificationSelected = () => {
    setIsSelected(true);
    setSelectedCounter(selectedCounter + 1);
  };

  const notificationUnselected = () => {
    setIsSelected(false);
    setSelectedCounter(selectedCounter - 1);
  };

  const renderVisibleComponent = () => {
    const accordionStyle = {
      borderBottomColor: Colors.darkgray,
      borderBottomWidth: !isCollapsed ? 0 : 0.4,
    };
    return !isDeleted && !isSelected ? (
      <List.Accordion
        title={`${title}`}
        titleNumberOfLines={3}
        description={
          <View>
            <Text style={[Gutters.tinyTMargin, { color: Colors.primary }]}>{channelName}</Text>
            <Text>{formatDate(datePublished)}</Text>
          </View>
        }
        left={() => (
          <View style={[Layout.justifyContentCenter]}>
            <Avatar.Image rounded size={35} source={_setImageUrl(Images.avatarImage)} />
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
        onPress={_handleCollapse}
        onLongPress={notificationSelected}
        style={[Gutters.smallBMargin, accordionStyle]}
      >
        <Text style={[Gutters.largeRPadding, styles.notificationBody]}>{body}</Text>
      </List.Accordion>
    ) : !isDeleted && isSelected ? (
      <List.Accordion
        title={`${title}`}
        titleNumberOfLines={3}
        description={
          <View>
            <Text style={[Gutters.tinyTMargin, { color: Colors.primary }]}>{channelName}</Text>
            <Text>{formatDate(datePublished)}</Text>
          </View>
        }
        left={() => (
          <View style={[Layout.justifyContentCenter]}>
            <Avatar.Image rounded size={35} source={_setImageUrl(Images.avatarSelected)} />
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
        onPress={_handleCollapse}
        onLongPress={notificationUnselected}
        style={[Gutters.smallBMargin, accordionStyle]}
      >
        {!shortPressSelectEnabled && (
          <Text style={[Gutters.largeRPadding, styles.notificationBody]}>{body}</Text>
        )}
      </List.Accordion>
    ) : (
      <></>
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
  badge: {
    borderRadius: 50,
    height: 14,
    width: 14,
  },
  notificationBody: { lineHeight: 23, textAlign: 'left' },
});

Notification.propTypes = {
  notification: PropTypes.object,
  index: PropTypes.number.isRequired,
  selectedCounter: PropTypes.number,
  setSelectedCounter: PropTypes.any,
  multiDeleteConfirmed: PropTypes.bool,
};

Notification.defaultProps = {
  notification: {},
  selectedCounter: {},
  setSelectedCounter: {},
  multiDeleteConfirmed: {},
};

export default Notification;
