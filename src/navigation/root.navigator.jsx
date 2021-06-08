import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthNavigator from './auth/auth.navigator';
import AppNavigator from './app/app.navigator';
import TimeoutScreen from '../screens/app/timeout/timeout.screen';

const RootStack = createStackNavigator();
const AppContainer = () => {
  const { isAuthenticated, isServerOffline } = useSelector((reducer) => reducer.userAuthReducer);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isServerOffline ? (
          <RootStack.Screen
            name="TimeoutScreen"
            component={TimeoutScreen}
            options={{
              headerShown: true,
              title: 'Error',
              header: () => null,
            }}
            initialParams={{ timeoutMessage: 'SERVER OFFLINE' }}
          />
        ) : isAuthenticated ? (
          <RootStack.Screen name="APP" component={AppNavigator} />
        ) : (
          <RootStack.Screen name="AUTH" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
