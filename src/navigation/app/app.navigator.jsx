import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/app/home/home.screen';
import ProfileScreen from '../../screens/app/profile/profile.screen';
import useTheme from '../../theme/hooks/useTheme';

import ServiceRequestScreen from '../../screens/app/service-request/service-request.screen';
import CreateServiceRequestScreen from '../../screens/app/service-request/create-service-request/create-service-request.screen';
import SelectLocationScreen from '../../screens/app/service-request/select-location/select-location.screen';

import { DrawerContent } from '../../components/molecules';
import AccountScreen from '../../screens/app/account/account.screen';
import ViewServiceRequestScreen from '../../screens/app/service-request/view-service-request/view-service-request.screen';

const Drawer = createDrawerNavigator();
const AppStack = createStackNavigator();

const AppNavigator = () => {
  const { Custom } = useTheme();
  return (
    <AppStack.Navigator screenOptions={Custom.globalNavigatorScreenOptions}>
      <AppStack.Screen
        name="App Home"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="CreateServiceRequest"
        component={CreateServiceRequestScreen}
        options={{ headerShown: true, title: 'New Service Request' }}
      />
      <AppStack.Screen
        name="SelectLocationScreen"
        component={SelectLocationScreen}
        options={{ headerShown: true, title: 'Select Location' }}
      />
      <AppStack.Screen
        name="ViewServiceRequest"
        component={ViewServiceRequestScreen}
        options={{ headerShown: true, title: 'View Service Request' }}
      />
    </AppStack.Navigator>
  );
};

const DrawerNavigator = () => {
  const { Common, Custom } = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={Custom.globalNavigatorScreenOptions}
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerStyle={Common.drawerStyle}
      initialRouteName="ServiceRequests"
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true, title: 'Home' }}
      />
      <Drawer.Screen
        name="ServiceRequests"
        component={ServiceRequestScreen}
        options={{ headerShown: true, title: 'Service Requests' }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: true, title: 'Profile' }}
      />
      <Drawer.Screen
        name="Accounts"
        component={AccountScreen}
        options={{ headerShown: true, title: 'Accounts' }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
