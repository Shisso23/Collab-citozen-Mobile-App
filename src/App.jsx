import React, { useEffect } from 'react';
import { LogBox } from 'react-native';

import { useDispatch } from 'react-redux';
import NavigationContainer from './navigation/root.navigator';
import { initAppAction } from './reducers/app-reducer/app.actions';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    LogBox.ignoreLogs(['Require cycle']);
    dispatch(initAppAction());
  }, []);

  return <NavigationContainer />;
};

export default App;
