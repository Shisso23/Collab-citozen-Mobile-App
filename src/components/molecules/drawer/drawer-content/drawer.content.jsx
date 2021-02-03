import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Drawer } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Avatar } from 'react-native-elements';
import { signOutAction } from '../../../../reducers/user-auth-reducer/user-auth.actions';
import useTheme from '../../../../theme/hooks/useTheme';

const DrawerContent = (props) => {
  const { navigation } = props;
  const { user } = useSelector((reducers) => reducers.userReducer);
  const avatarUrl = { uri: _.get(user, 'avatar', '') };
  const dispatch = useDispatch();
  const { Fonts, Gutters, Layout } = useTheme();
  const _signOut = () => {
    dispatch(signOutAction());
  };
  return (
    <View style={[Layout.fill]}>
      <DrawerContentScrollView {...props}>
        <Drawer.Section>
          <View style={[Layout.alignItemsCenter, Gutters.smallPadding]}>
            <Avatar rounded source={avatarUrl} size={65} />
            <Text style={[Fonts.textLarge]}>{user.fullName}</Text>
          </View>
        </Drawer.Section>
        <Drawer.Section>
          <Drawer.Item icon={'home'} label="Home" onPress={() => navigation.navigate('Home')} />
          <Drawer.Item
            icon={'information'}
            label="Service Requests"
            onPress={() => console.warn('Service Acccount Pressed')}
          />
          <Drawer.Item icon={'file'} label="Accounts" onPress={() => navigation.navigate('Home')} />
        </Drawer.Section>

        <Drawer.Section>
          <Drawer.Item
            icon={'account'}
            label="Profile"
            onPress={() => navigation.navigate('Profile')}
          />
        </Drawer.Section>
        <Drawer.Item icon={'exit-to-app'} label="Sign Out" onPress={_signOut} />
      </DrawerContentScrollView>
    </View>
  );
};

DrawerContent.propTypes = {
  navigation: PropTypes.object.isRequired,
};
export default DrawerContent;
