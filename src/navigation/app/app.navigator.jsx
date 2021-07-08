import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/app/home/home.screen';
import ProfileScreen from '../../screens/app/profile/profile.screen';
import useTheme from '../../theme/hooks/useTheme';

import ServiceRequestScreen from '../../screens/app/service-request/service-request.screen';
import CreateServiceRequestScreen from '../../screens/app/service-request/create-service-request/create-service-request.screen';
import SelectLocationScreen from '../../screens/app/service-request/select-location/select-location.screen';

import SubscribeToChannelsScreen from '../../screens/app/channels/subscribe-to-channels/subscribe-to-channels.screen';
import ViewSubscribedToChannelsScreen from '../../screens/app/channels/view-subscribed-to-channels.screen';
import ViewSubscribedToChannelDetailsScreen from '../../screens/app/channels/view-subscribed-to-channels-details.screen';
import ViewSubscribingChannelsDetailsScreen from '../../screens/app/channels/subscribe-to-channels/view-subscribing-channel-details.screen';

import { DrawerContent } from '../../components/molecules';
import HeaderBackGround from '../../components/atoms/header-background';

import ViewServiceRequestScreen from '../../screens/app/service-request/view-service-request/view-service-request.screen';
import ViewNewsFeedArticleScreen from '../../screens/app/newsfeed/view-newsfeed-article.screen';

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
        name="SelectLocationScreen"
        component={SelectLocationScreen}
        options={{
          headerShown: false,
          title: 'Select Location',
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name="CreateServiceRequest"
        component={CreateServiceRequestScreen}
        options={{
          headerShown: false,
          title: 'New Service Request',
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />

      <AppStack.Screen
        name="ViewServiceRequest"
        component={ViewServiceRequestScreen}
        options={{
          headerShown: true,
          title: 'View Service Request',
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />

      <AppStack.Screen
        name="ViewNewsFeedArticle"
        component={ViewNewsFeedArticleScreen}
        options={{
          headerShown: false,
          title: 'Select Location',
        }}
      />

      <AppStack.Screen
        name="SubscribeToChannels"
        component={SubscribeToChannelsScreen}
        options={{
          headerShown: false,
          title: 'Subscribe To Channels',
        }}
      />

      <AppStack.Screen
        name="ViewSubscribingChannelsDetailsScreen"
        component={ViewSubscribingChannelsDetailsScreen}
        options={{
          headerShown: false,
          title: 'View Subscribing Channels Details',
        }}
      />

      <AppStack.Screen
        name="ViewSubscribedToChannelDetails"
        component={ViewSubscribedToChannelDetailsScreen}
        options={{
          headerShown: false,
          title: 'Subscribed To Channel',
        }}
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
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true, title: 'Home' }}
      />
      <Drawer.Screen
        name="ServiceRequests"
        component={ServiceRequestScreen}
        options={{
          headerShown: true,
          title: 'Service Requests',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="ViewSubscribeToChannels"
        component={ViewSubscribedToChannelsScreen}
        options={{
          headerShown: true,
          title: 'Subscribe To Channels Screen',
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
