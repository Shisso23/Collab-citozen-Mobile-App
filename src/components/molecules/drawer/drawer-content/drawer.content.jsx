import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Drawer, Divider } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';

import { signOutAction } from '../../../../reducers/user-auth-reducer/user-auth.actions';
import useTheme from '../../../../theme/hooks/useTheme';
import { Colors } from '../../../../theme/Variables';
import { permissionsService } from '../../../../services';

const theme = {
  colors: {
    text: Colors.white,
  },
};
const DrawerContent = (props) => {
  const { navigation } = props;
  const { user } = useSelector((reducers) => reducers.userReducer);
  const [codePushVersion, setCodePushVersion] = useState();
  const avatarUrl = { uri: _.get(user, 'avatar', '') };
  const dispatch = useDispatch();
  const { Fonts, Gutters, Layout, Common } = useTheme();
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

  return (
    <View style={[Layout.fill]}>
      <DrawerContentScrollView {...props}>
        <Drawer.Section style={{ backgroundColor: Colors.softBlue }}>
          <View style={[Layout.rowHCenter, Gutters.smallPadding]}>
            <Avatar rounded source={avatarUrl} size={65} />
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
            onPress={() => navigation.navigate('ServiceRequests')}
            theme={theme}
          />
          <Drawer.Item
            icon="ticket-account"
            label="Accounts"
            onPress={() => navigation.navigate('Accounts')}
            theme={theme}
          />

          <Drawer.Item
            icon="file"
            label="Channels"
            onPress={() => navigation.navigate('ViewSubscribeToChannels')}
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
            <Drawer.Item
              icon="phone"
              label="Contacts"
              onPress={async () => {
                await permissionsService.checkLocationPermissions();
                return navigation.navigate('Contacts');
              }}
            />
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
