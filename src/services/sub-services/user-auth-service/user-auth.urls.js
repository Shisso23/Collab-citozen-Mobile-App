import appConfig from '../../../config';

const { apiUrl } = appConfig;
export default {
  tokenUrl: () => `${apiUrl}/MobileToken/GetTokenForUser`,
  registerUrl: () => `${apiUrl}/Account/NewRegistration`,
  forgotPasswordUrl: () => `${apiUrl}/Account/ResetPassword`,
};
