const config = {
  screens: {
    APP: {
      screens: {
        HomeScreen: 'Home',
      },
    },
  },
};

const linking = {
  prefixes: ['collaborator://'],
  config,
};

export default linking;
