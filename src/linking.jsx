const config = {
  screens: {
    APP: {
      screens: {
        HomeScreen: 'PaymentStatus', // TODO change the screen to the correct one once payments have been integrated
      },
    },
  },
};

const linking = {
  prefixes: ['https://pay.collaboratoronline.com', 'collaborator://'],
  config,
};

export default linking;
