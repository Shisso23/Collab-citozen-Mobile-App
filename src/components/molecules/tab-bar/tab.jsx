/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, View, Platform } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import _ from 'lodash';
import { hasGmsSync, hasHmsSync } from 'react-native-device-info';

import { useTheme } from '../../../theme';
import { Colors } from '../../../theme/Variables';
import ShortCutsActionSheetContent from '../feature-shortcusts/feature-shortcusts-content';
import { flashService, permissionsService } from '../../../services';

const tabIcons = {
  Home: { icon: 'home', type: 'fontisto', iconColor: Colors.white },
  addFeatures: { icon: 'plus', type: 'font-awesome-5', iconColor: Colors.primary },
  Profile: { icon: 'user-alt', type: 'font-awesome-5', iconColor: Colors.white },
};

const { width } = Dimensions.get('window');

const Tab = ({ route, navigation, isFocused }) => {
  const actionSheetRef = useRef();
  const { Layout, Common } = useTheme();
  const name = _.get(route, 'name');
  const iconName = _.get(tabIcons, `${name}.icon`);
  const iconType = _.get(tabIcons, `${name}.type`);

  const onTabPress = () => {
    if (name === 'addFeatures') {
      openActionSheet();
    } else if (name === 'Home') {
      navigation.navigate('HomeScreen');
    } else {
      navigation.navigate(route.name);
    }
  };

  const navigateToCreateServiceRequest = async () => {
    if (hasGmsSync() || Platform.OS === 'ios') {
      permissionsService
        .checkLocationPermissions()
        .then(() => {
          navigation.navigate('SelectLocationScreen', {
            fromSubscribedChannels: false,
            showSRPins: true,
          });
        })
        .catch(() => {
          flashService.error('Please grant permissions to select a location.');
        });
    } else if (hasHmsSync()) {
      permissionsService
        .requestHmsLocationPermissions()
        .then(() => {
          navigation.navigate('SelectLocationScreen', {
            fromSubscribedChannels: false,
            showSRPins: true,
          });
        })
        .catch(() => {
          flashService.error('Please grant permissions to select a location.');
        });
    }
    closeActionSheet();
  };

  const navigateToSubscribeToChannel = async () => {
    if (hasGmsSync() || Platform.OS === 'ios') {
      permissionsService
        .checkLocationPermissions()
        .then(() => {
          navigation.navigate('SelectLocationScreen', {
            fromSubscribedChannels: true,
            showSRPins: false,
          });
        })
        .catch(() => {
          flashService.error('Please grant permissions to select a location.');
        });
    } else if (hasHmsSync()) {
      permissionsService
        .requestHmsLocationPermissions()
        .then(() => {
          navigation.navigate('SelectLocationScreen', {
            fromSubscribedChannels: true,
            showSRPins: false,
          });
        })
        .catch(() => {
          flashService.error('Please grant permissions to select a location.');
        });
    }
    closeActionSheet();
  };
  const navigateToAddAccount = () => {
    closeActionSheet();
    navigation.navigate('Accountchannels');
  };

  const openActionSheet = () => {
    return actionSheetRef.current.setModalVisible(true);
  };

  const closeActionSheet = () => {
    return actionSheetRef.current?.setModalVisible(false);
  };

  return (
    <>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled
        animated
        containerStyle={{ backgroundColor: Colors.softBlue }}
        extraScroll={20}
      >
        <ShortCutsActionSheetContent
          onCancel={closeActionSheet}
          onPressAddAccount={navigateToAddAccount}
          onPressNewServiceRequest={navigateToCreateServiceRequest}
          onPressSubscribeToChannel={navigateToSubscribeToChannel}
        />
      </ActionSheet>
      <Pressable onPress={onTabPress} disabled={isFocused && name !== 'Home'}>
        {({ pressed }) => (
          <View
            style={[
              Layout.rowCenter,
              styles.tabContainer,
              isFocused && styles.tabContainerFocused,
              pressed && Common.pressed,
            ]}
          >
            <Icon
              name={iconName}
              type={iconType}
              color={isFocused ? Colors.primary : Colors.white}
              size={name === 'addFeatures' ? 25 : 30}
              containerStyle={[
                {
                  borderRadius: name === 'addFeatures' ? 40 : 0,
                  borderWidth: name === 'addFeatures' ? 1 : 0,
                  borderColor: isFocused ? Colors.primary : Colors.white,
                  padding: 5,
                  width: name === 'addFeatures' ? 35 : 45,
                  height: name === 'addFeatures' ? 35 : 45,
                },
              ]}
            />
          </View>
        )}
      </Pressable>
    </>
  );
};

export default Tab;

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: width <= 320 ? 20 : 30,
    paddingVertical: width <= 320 ? 8 : 10,
  },
  tabContainerFocused: {
    backgroundColor: Colors.primary10Percent,
    borderRadius: 23,
  },
});

Tab.propTypes = {
  route: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  isFocused: PropTypes.bool.isRequired,
};
