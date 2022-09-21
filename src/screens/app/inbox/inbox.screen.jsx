import React, { useEffect, useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';

import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import useTheme from '../../../theme/hooks/useTheme';
import ScreenContainer from '../../../components/containers/screen-container/screen.container';
import PaddedContainer from '../../../components/containers/padded-container/padded.container';
import Notification from '../../../components/molecules/notification';
import { getNotificationsAction } from '../../../reducers/notification-reducer/notification.actions';
import { promptConfirm } from '../../../helpers/prompt.helper';
import { setUnOpenedNotificationsAction } from '../../../reducers/notification-reducer/notification.reducer';
import { setTabBarVisibilityAction } from '../../../reducers/navigation-reducer/navigation.actions';

const InboxScreen = () => {
  const { Colors } = useTheme();
  const { notifications, isLoading, unOpenedNotifications } = useSelector(
    (reducers) => reducers.notificationReducer,
  );
  const { Fonts, Layout, Images, Common, Gutters } = useTheme();
  const dispatch = useDispatch();
  const [atLeastOneSelected, setAtLeastOneSelected] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(0);
  const [multiDeleteConfirmed, setMultiDeleteConfirmed] = useState(false);

  useEffect(() => {
    dispatch(setTabBarVisibilityAction(true));
    dispatch(getNotificationsAction());
  }, []);

  useEffect(() => {
    if (selectedCounter === 0) {
      setAtLeastOneSelected(false);
    } else {
      setAtLeastOneSelected(true);
    }
  }, [selectedCounter]);

  const renderPlaceHolders = () => {
    const dummyArray = [1, 2, 3, 4, 5, 6, 7];
    return (
      <View>
        {isLoading ? (
          dummyArray.map((i) => {
            return (
              <View
                key={`${i}`}
                style={[
                  Common.textInputWithShadow,
                  Gutters.tinyMargin,
                  Gutters.smallVMargin,
                  ...[{ height: 90 }],
                ]}
              >
                <Placeholder Animation={Fade} Left={PlaceholderMedia} Right={PlaceholderMedia}>
                  <PlaceholderLine width={80} />
                  <PlaceholderLine />
                  <PlaceholderLine width={30} />
                </Placeholder>
              </View>
            );
          })
        ) : (
          <Text style={Fonts.titleRegular}>
            There are no Notifications here. Please subscribe to a channel to receive notifications.
          </Text>
        )}
      </View>
    );
  };

  const deleteNotificationsSelected = () => {
    promptConfirm(
      'Are you sure?',
      'Are you sure you want to delete all selected items?',
      'Delete',
      () => {
        setSelectedCounter(0);
        setMultiDeleteConfirmed(true);
        setTimeout(() => setMultiDeleteConfirmed(false), 100);
        setUnOpenedNotificationsAction(unOpenedNotifications - selectedCounter);
      },
    );
  };

  return (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Layout.fill]}
      resizeMode="cover"
    >
      <Text style={[Layout.alignSelfCenter, Fonts.titleTiny, Gutters.regularTMargin]}>
        Notifications
      </Text>
      {!isLoading ? (
        <ScreenContainer>
          {atLeastOneSelected && (
            <PaddedContainer>
              <View style={Layout.alignSelfEnd}>
                <Icon
                  name="trash"
                  size={27}
                  backgroundColor="transparent"
                  color={Colors.gray}
                  onPress={deleteNotificationsSelected}
                />
              </View>
            </PaddedContainer>
          )}
          {_.get(notifications, 'Feed', []).map((notification, index) => {
            return (
              <Notification
                notification={notification}
                key={_.get(notification, 'obj_id', index)}
                index={index}
                selectedCounter={selectedCounter}
                setSelectedCounter={setSelectedCounter}
                multiDeleteConfirmed={multiDeleteConfirmed}
              />
            );
          })}
        </ScreenContainer>
      ) : (
        renderPlaceHolders()
      )}
    </ImageBackground>
  );
};

InboxScreen.propTypes = {};

InboxScreen.defaultProps = {};

export default InboxScreen;
