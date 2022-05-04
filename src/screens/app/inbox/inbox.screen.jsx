import React, { useEffect, useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import ScreenContainer from '../../../components/containers/screen-container/screen.container';
import PaddedContainer from '../../../components/containers/padded-container/padded.container';
import Notification from '../../../components/molecules/notification';
import { LoadingComponent } from '../../../components';
import { getNotificationsAction } from '../../../reducers/notification-reducer/notification.actions';
import { promptConfirm } from '../../../helpers/prompt.helper';

const InboxScreen = () => {
  const { Colors } = useTheme();
  const { notifications, isLoading } = useSelector((reducers) => reducers.notificationReducer);
  const { Fonts, Layout, Images } = useTheme();
  const dispatch = useDispatch();
  const [atLeastOneSelected, setAtLeastOneSelected] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(0);
  const [multiDeleteConfirmed, setMultiDeleteConfirmed] = useState(false);

  useEffect(() => {
    dispatch(getNotificationsAction());
  }, []);

  useEffect(() => {
    if (selectedCounter === 0) {
      setAtLeastOneSelected(false);
    } else {
      setAtLeastOneSelected(true);
    }
  }, [selectedCounter]);

  const deleteNotificationsSelected = () => {
    promptConfirm(
      'Are you sure?',
      'Are you sure you want to delete all selected items?',
      'Delete',
      () => {
        setSelectedCounter(0);
        setMultiDeleteConfirmed(true);
        setTimeout(() => setMultiDeleteConfirmed(false), 2000);
      },
    );
  };

  return !isLoading ? (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Layout.fill]}
      resizeMode="cover"
    >
      <ScreenContainer>
        {atLeastOneSelected && (
          <PaddedContainer>
            <Text style={[Layout.alignSelfCenter, Fonts.titleTiny]}>Notifications</Text>
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
        {!atLeastOneSelected && (
          <PaddedContainer>
            <Text style={[Layout.alignSelfCenter, Fonts.titleTiny]}>Notifications</Text>
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
    </ImageBackground>
  ) : (
    <LoadingComponent />
  );
};

InboxScreen.propTypes = {};

InboxScreen.defaultProps = {};

export default InboxScreen;
