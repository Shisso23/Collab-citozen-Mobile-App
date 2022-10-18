const config = {
  screens: {
    APP: {
      screens: {
        HomeScreen: 'Home', // TODO change the screen to the correct one once payments have been integrated
      },
    },
  },
};

const linking = {
  prefixes: ['collaborator://'],
  config,
};

export default linking;
