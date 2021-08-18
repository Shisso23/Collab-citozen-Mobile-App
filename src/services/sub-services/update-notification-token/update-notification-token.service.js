import globalUrl from '../global/global.service.urls';
import { dataUpdateNotificationToken } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';

const updateNotificationToken = async (token, deviceID) => {
  const url = globalUrl.globalFunctionUrl();
  const data = await dataUpdateNotificationToken(token, deviceID);
  const apiResponse = await authNetworkService.post(url, data);
  return apiResponse;
};

export default {
  updateNotificationToken,
};
