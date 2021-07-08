import stcUrls from './subscribe-to-channels.urls';
import authNetworkService from '../auth-network-service/auth-network.service';

const subscribeToChannels = (municipalitiyId, subscriptionList, user) => {
  const url = stcUrls.subscribeToChannelsUrl();
  let subscriptionModel = '<Objects> ';
  subscriptionModel += subscriptionList
    .map(
      (obj) =>
        `<Channel_Subscription> <F1>${user.user_id}</F1> <F2>${municipalitiyId}</F2> <F4>${
          obj.obj_id
        }</F4> <F11>${obj.Subscribed === false ? 'T' : 'F'}</F11>  </Channel_Subscription> `,
    )
    .join(' ');
  subscriptionModel += '</Objects>';

  try {
    return authNetworkService.post(url, subscriptionModel);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify(err, null, 2));
    throw err;
  }
};

const unSubscribeFromInterestType = (user, interestTypeId, channelId, subscriptiontype) => {
  const url = stcUrls.subscribeToChannelsUrl();
  let subscriptionModel = '<Objects> ';
  subscriptionModel += `<Channel_Subscription> <F1>${user.user_id}</F1> <F2>${channelId}</F2> <F4>${interestTypeId.obj_id}</F4> <F11>${subscriptiontype}</F11>  </Channel_Subscription> `;
  subscriptionModel += '</Objects>';

  try {
    return authNetworkService.post(url, subscriptionModel);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify(err, null, 2));
    throw err;
  }
};

export default {
  subscribeToChannels,
  unSubscribeFromInterestType,
};
