import React from 'react';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import ScreenContainer from '../../../components/containers/screen-container/screen.container';
import PaddedContainer from '../../../components/containers/padded-container/padded.container';
import Notification from '../../../components/molecules/notification';
import { LoadingComponent } from '../../../components';
import { getNotification } from '../../../reducers/notification-reducer/notification.actions';

const InboxScreen = () => {
  const { notification, isLoading } = useSelector((reducers) => reducers.notificationReducer);
  const { Common } = useTheme();
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getNotification());
    }, []),
  );

  return !isLoading ? (
    <ScreenContainer>
      <PaddedContainer>
        <Text style={Common.centerTitle}>Notifications</Text>
        <Text style={Common.centerSubtitle}>Click to mark as read</Text>
      </PaddedContainer>
      {notification.map((message) => {
        return <Notification notification={message} key={_.get(message, 'id')} />;
      })}
    </ScreenContainer>
  ) : (
    <LoadingComponent />
  );
};

InboxScreen.propTypes = {};

InboxScreen.defaultProps = {};

export default InboxScreen;
