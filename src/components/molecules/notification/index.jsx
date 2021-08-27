import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Icon, ListItem, Text } from 'react-native-elements';
import { Avatar } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
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
import { promptConfirmDelete } from '../../../helpers/prompt.helper';
import useTheme from '../../../theme/hooks/useTheme';
import SwipeRowContainer from '../../atoms/swipe-row/swipe-row';

const Notification = ({ notification }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((reducers) => reducers.userReducer);
  const { deleteNotificationPreview } = useSelector((reducers) => reducers.notificationReducer);
  const notificationId = _.get(notification, 'obj_id');
  const message = `${_.get(notification, 'title', '')}\n\n${_.get(notification, 'body', '')}`;
  const seen = _.get(notification, 'seen', false) === 'Yes';

  const { Fonts, Layout, Images, Colors } = useTheme();
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSeen, setIsSeen] = useState(seen);
  const [isDeleting, setDeleting] = useState(false);

  const _handleCollapse = () => {
    if (!isSeen) {
      const seenAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
      dispatch(openNotificationAction(notificationId, seenAt, _.get(user, 'user_id', '')));
      dispatch(getUnOpenedNotificationsAction());
      setIsSeen(true);
    }
    setIsCollapsed(!isCollapsed);
  };

  const _handleNeedForCollapse = ({ nativeEvent: { lines } }) => {
    if (lines.length > 1) {
      setNeedsCollapse(true);
    }
  };

  const _handleDelete = () => {
    const deletedAt = Moment(new Date()).format('yyyy-mm-DD hh:mm:ss');
    promptConfirmDelete('Are you sure you want to delete this item?', () => {
      setDeleting(true);
      dispatch(deleteNotificationAction(notificationId, deletedAt, _.get(user, 'user_id', '')));
    });
  };

  const _setImageUrl = (image) => {
    return !image ? null : image;
  };

  const _renderCollapseText = () => (
    <>
      <Collapsible collapsed={isCollapsed} collapsedHeight={20}>
        <Text style={[Fonts.textTiny]}>{message}</Text>
      </Collapsible>
    </>
  );

  const _renderText = () => (
    <>
      <Text onTextLayout={_handleNeedForCollapse}>{message}</Text>
    </>
  );
  const renderHiddenComponent = () => (
    <TrashButton onPress={_handleDelete} iconSize={27} loading={isDeleting} />
  );

  const renderVisibleComponent = () => (
    <ListItem onPress={_handleCollapse} bottomDivider>
      <View style={[Layout.justifyContentCenter]}>
        <Avatar.Image rounded size={35} source={_setImageUrl(Images.avatarImage)} />
      </View>

      <ListItem.Content>{needsCollapse ? _renderCollapseText() : _renderText()}</ListItem.Content>
      {needsCollapse && isSeen && (
        <Icon
          name={isCollapsed ? 'chevron-down' : 'chevron-up'}
          type="font-awesome-5"
          size={15}
          containerStyle={styles.chevronContainer}
        />
      )}
      {!isSeen && (
        <Badge status="error" badgeStyle={[{ backgroundColor: Colors.primary }, styles.badge]} />
      )}
    </ListItem>
  );

  return (
    <SwipeRowContainer
      preview={deleteNotificationPreview}
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
  chevronContainer: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
});

Notification.propTypes = {
  notification: PropTypes.object,
};

Notification.defaultProps = {
  notification: {},
};

export default Notification;
