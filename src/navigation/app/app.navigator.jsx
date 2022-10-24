import React, { useLayoutEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Keyboard } from 'react-native';
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
import NewsFeedArticleDetailsScreen from '../../screens/app/newsfeed/view-newsfeed-article-details.screen';
import InboxScreen from '../../screens/app/inbox/inbox.screen';
import AccountsScreen from '../../screens/app/accounts/accounts.screen';
import AccountPaymentScreen from '../../screens/app/accounts/account-payment.screen';
import StatementViewScreen from '../../screens/app/accounts/statementView.screen';
import AccountChannelsScreen from '../../screens/app/accounts/account.channels.screen';
import AddAccountScreen from '../../screens/app/accounts/add-account.screen';
import ContactDetails from '../../screens/app/contacts/contacts.details.screen';
import AccountDetailsScreen from '../../screens/app/accounts/account-details.screen';
import ReadingsHistoryScreen from '../../screens/app/accounts/readings-history.screen';
import SubmitMeterReadingScreen from '../../screens/app/accounts/submit-readings.screen';
import CreateNotificationScreen from '../../screens/app/channels/create-notification/create-notification.screen';
import TabBar from '../../components/molecules/tab-bar/tab-bar';
import NewsScreen from '../../screens/news-screen/news.screen';

const Drawer = createDrawerNavigator();
const AppStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { Custom } = useTheme();
  return (
    <AppStack.Navigator screenOptions={Custom.globalNavigatorScreenOptions} headerMode="screen">
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
          headerShown: true,
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
        name="ViewNewsFeedArticleDetails"
        component={NewsFeedArticleDetailsScreen}
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
      <AppStack.Screen
        name="CreateNotification"
        component={CreateNotificationScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          headerShown: true,
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />
      <AppStack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
        options={{
          headerShown: true,
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />
      <AppStack.Screen
        name="ReadingsHistory"
        component={ReadingsHistoryScreen}
        options={{
          headerShown: true,
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />
      <AppStack.Screen
        name="SubmitReading"
        component={SubmitMeterReadingScreen}
        options={{
          headerShown: true,
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />
      <AppStack.Screen
        name="StatementView"
        component={StatementViewScreen}
        options={{
          headerShown: true,
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />
      <AppStack.Screen
        name="Accountchannels"
        component={AccountChannelsScreen}
        options={{
          headerShown: true,
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />
      <AppStack.Screen
        name="AddAccount"
        component={AddAccountScreen}
        options={{
          headerShown: true,
          header: (props) => <HeaderBackGround {...props} backButton />,
        }}
      />
      <AppStack.Screen
        name="AccountPayment"
        component={AccountPaymentScreen}
        options={{
          headerShown: true,
          header: (props) => <HeaderBackGround {...props} backButton />,
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
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true }} />
      <Drawer.Screen name="News" component={NewsScreen} options={{ headerShown: true }} />
      <Drawer.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          headerShown: true,
          title: 'Accounts',
        }}
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
        name="ContactDetails"
        component={ContactDetails}
        options={{
          headerShown: true,
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

const renderEmptyComponent = () => <View />;

const TabNavigator = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(undefined);
  useLayoutEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => !keyboardVisible && <TabBar {...props} />}
      lazy={false}
      screenOptions={{}}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={AppNavigator} />
      <Tab.Screen name="addFeatures" component={renderEmptyComponent} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
