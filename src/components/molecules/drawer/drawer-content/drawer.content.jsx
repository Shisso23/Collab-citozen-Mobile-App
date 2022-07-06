import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Share } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Drawer, Divider } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from 'react-native-elements';
import DeviceInfo, { hasGmsSync, hasHmsSync } from 'react-native-device-info';
import codePush from 'react-native-code-push';

import { signOutAction } from '../../../../reducers/user-auth-reducer/user-auth.actions';
import useTheme from '../../../../theme/hooks/useTheme';
import { Colors } from '../../../../theme/Variables';
import { flashService, permissionsService, userService } from '../../../../services';
import { openAppSetting } from '../../../../helpers/app-seettings.helper';
import { myChannelsSelector } from '../../../../reducers/my-channels/my-channels.reducer';
import { getMyChannelsAction } from '../../../../reducers/my-channels/my-channels.actions';
import appConfig from '../../../../config';

const theme = {
  colors: {
    text: Colors.white,
  },
};
const DrawerContent = (props) => {
  const { navigation } = props;
  const { user } = useSelector((reducers) => reducers.userReducer);
  const [codePushVersion, setCodePushVersion] = useState();
  const [accountApplicableChannelsExist, setAccountApplicableChannelsExist] = useState(false);
  const dispatch = useDispatch();
  const { Fonts, Gutters, Layout, Common, Images } = useTheme();
  const { myChannels } = useSelector(myChannelsSelector);
  const { avatarImage } = Images;
  const { combinedLink } = appConfig;

  const _signOut = () => {
    dispatch(signOutAction());
  };

  const getAppCenterCodeVersion = () => {
    codePush.getCurrentPackage().then((update) => {
      setCodePushVersion(_.get(update, 'label', 'v0'));
    });
  };

  useEffect(() => {
    getAppCenterCodeVersion();
  }, []);

  useEffect(() => {
    dispatch(getMyChannelsAction());
    const accountApplicableChannels = myChannels.filter(
      (channel) => _.get(channel, 'accountApplicable', null) === true,
    );
    if (accountApplicableChannels.length === 0) {
      setAccountApplicableChannelsExist(false);
    } else {
      setAccountApplicableChannelsExist(true);
    }
  }, [myChannels.length]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `You have been invited to download Collab Citizen!\n\nCollab Citizen allows consumers to stay in control and up to date with their municipal accounts.\n\nAvailable on Google Play Store and Apple App Store: ${combinedLink}`,
      }).then(() => {
        userService.invitedUserRecord(user.user_id);
      });
    } catch (error) {
      console.warn(error.message);
    }
  };

  return (
    <View style={[Layout.fill]}>
      <DrawerContentScrollView {...props}>
        <Drawer.Section style={{ backgroundColor: Colors.softBlue }}>
          <View style={[Layout.rowHCenter, Gutters.smallPadding]}>
            <Avatar rounded source={avatarImage} size={65} />
            <Text style={[Fonts.textLarge, Gutters.smallHMargin, Common.drawerUserText]}>
              {user.fullName}
            </Text>
          </View>
          <Divider style={[Common.backgroundWhite, Gutters.regularLMargin]} />
          <Drawer.Item
            icon="newspaper"
            label="News"
            onPress={() => navigation.navigate('Home')}
            theme={theme}
          />
          <Drawer.Item
            icon="information"
            label="Service Requests"
            onPress={async () => {
              if (hasGmsSync()) {
                permissionsService.checkLocationPermissions().catch(() => {
                  flashService.error('Please grant permissions to select a location.');
                });
              } else if (hasHmsSync()) {
                permissionsService
                  .requestHmsLocationPermissions()

                  .catch(() => {
                    flashService.error('Please grant permissions to select a location.');
                  });
              }
              navigation.navigate('ServiceRequests');
            }}
            theme={theme}
          />
          {accountApplicableChannelsExist && (
            <Drawer.Item
              icon="ticket-account"
              label="Accounts"
              onPress={() => {
                return navigation.navigate('Accounts');
              }}
              theme={theme}
            />
          )}
          <Drawer.Item
            icon="file"
            label="Channels"
            onPress={async () => {
              if (hasGmsSync()) {
                permissionsService.checkLocationPermissions().catch(() => {
                  flashService.error('Please grant permissions to select a location.');
                });
              } else if (hasHmsSync()) {
                permissionsService
                  .requestHmsLocationPermissions()

                  .catch(() => {
                    flashService.error('Please grant permissions to select a location.');
                  });
              }
              return navigation.navigate('ViewSubscribeToChannels');
            }}
            theme={theme}
          />
          <Drawer.Item
            icon="phone"
            label="Contacts"
            onPress={async () => {
              if (hasGmsSync()) {
                permissionsService.checkLocationPermissions().catch(() => {
                  flashService.error('Please grant permissions to select a location.');
                });
              } else if (hasHmsSync()) {
                permissionsService
                  .requestHmsLocationPermissions()

                  .catch(() => {
                    flashService.error('Please grant permissions to select a location.');
                  });
              }
              return navigation.navigate('ContactDetails');
            }}
            theme={theme}
          />
        </Drawer.Section>

        <View style={{ backgroundColor: Colors.white }}>
          <Drawer.Section>
            <Drawer.Item
              icon="account"
              label="Profile"
              onPress={() => navigation.navigate('Profile')}
            />
            <Drawer.Item icon="card-account-mail" label="Invite a Friend" onPress={onShare} />
            <Drawer.Item icon="cog" label="Settings" onPress={openAppSetting} />
          </Drawer.Section>
          <Drawer.Item icon="exit-to-app" label="Sign Out" onPress={_signOut} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.versionContainer}>
        <Text style={[Colors.gray]}>Version </Text>
        <Text style={[Colors.gray]}>{DeviceInfo.getVersion()}</Text>
        <Text
          style={[styles.smallText, Gutters.smallLPadding]}
        >{`Code Version ${codePushVersion}`}</Text>
      </View>
    </View>
  );
};

DrawerContent.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  smallText: {
    color: Colors.black,
    fontSize: 12,
  },
  versionContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
export default DrawerContent;
