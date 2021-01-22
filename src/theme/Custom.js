import { CardStyleInterpolators } from '@react-navigation/stack';

export default ({ Colors, FontFamily }) => {
  return {
    globalNavigatorScreenOptions: {
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: Colors.secondary,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        },
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTitleStyle: {
        fontFamily: FontFamily.secondary,
        color: Colors.white,
      },
      headerTintColor: Colors.white,
      cardStyle: {
        backgroundColor: Colors.white,
      },
    },
  };
};
