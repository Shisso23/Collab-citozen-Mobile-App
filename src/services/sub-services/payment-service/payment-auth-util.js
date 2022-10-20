import config from '../../../config';

const constructOAuthTokenData = () => ({
  grant_type: 'client_credentials',
  scope: config.payAtScope,
});

export default {
  constructOAuthTokenData,
};
