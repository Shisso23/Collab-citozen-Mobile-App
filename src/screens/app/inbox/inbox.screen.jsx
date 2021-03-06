import React, { useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import ScreenContainer from '../../../components/containers/screen-container/screen.container';
import PaddedContainer from '../../../components/containers/padded-container/padded.container';
import Notification from '../../../components/molecules/notification';
import { LoadingComponent } from '../../../components';
import { getNotificationsAction } from '../../../reducers/notification-reducer/notification.actions';

const InboxScreen = () => {
  const { notifications, isLoading } = useSelector((reducers) => reducers.notificationReducer);
  const { Fonts, Layout, Images } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNotificationsAction());
  }, []);

  return !isLoading ? (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Layout.fill]}
      resizeMode="cover"
    >
      <ScreenContainer>
        <PaddedContainer>
          <Text style={[Layout.alignSelfCenter, Fonts.titleTiny]}>Notifications</Text>
        </PaddedContainer>
        {_.get(notifications, 'Feed', []).map((notification, index) => {
          return (
            <Notification
              notification={notification}
              key={_.get(notification, 'obj_id', index)}
              index={index}
            />
          );
        })}
      </ScreenContainer>
    </ImageBackground>
  ) : (
    <LoadingComponent />
  );
};

InboxScreen.propTypes = {};

InboxScreen.defaultProps = {};

export default InboxScreen;
