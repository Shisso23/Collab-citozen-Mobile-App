import React, { useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Badge, Icon, ListItem, Text } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import _ from 'lodash';

import PropTypes from 'prop-types';
import {
  openNotificationAction,
  getUnOpenedNotificationsAction,
  deleteNotificationAction,
} from '../../../reducers/notification-reducer/notification.actions';
import { TrashButton } from '../../atoms';
import { promptConfirmDelete } from '../../../helpers/prompt.helper';

const LOGO = require('../../../assets/images/Logo.png');

const Notification = ({ notification }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((reducers) => reducers.userReducer);
  const notificationId = _.get(notification, 'obj_id');
  const message = _.get(notification, 'body');
  const title = _.get(notification, 'title');
  const seen = _.get(notification, 'seen') === 'Yes';

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

  const _renderCollapseText = () => (
    <>
      <Collapsible collapsed={isCollapsed} collapsedHeight={20}>
        <ListItem.Title>
          {title}
          {'\n'}
          {message}
        </ListItem.Title>
      </Collapsible>
    </>
  );

  const _renderText = () => (
    <Text onTextLayout={_handleNeedForCollapse}>
      {title}
      {'\n'}
      {message}
    </Text>
  );

  return (
    <ListItem onPress={_handleCollapse} bottomDivider>
      <Image source={LOGO} style={styles.collabLogo} />
      <ListItem.Content>{needsCollapse ? _renderCollapseText() : _renderText()}</ListItem.Content>
      {needsCollapse && isSeen && (
        <Icon
          name={isCollapsed ? 'chevron-down' : 'chevron-up'}
          type="font-awesome-5"
          size={15}
          containerStyle={styles.chevronContainer}
        />
      )}
      {!isSeen && <Badge status="error" />}
      <TrashButton onPress={_handleDelete} loading={isDeleting} />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  chevronContainer: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  collabLogo: { height: 15, width: 70 },
});

Notification.propTypes = {
  notification: PropTypes.object,
};

Notification.defaultProps = {
  notification: {},
};

export default Notification;
