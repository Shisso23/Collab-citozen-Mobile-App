import { DefaultTheme } from 'react-native-paper';
import { Colors } from './Variables';

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    accent: Colors.secondary,
  },
};
