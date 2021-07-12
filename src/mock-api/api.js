import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import appConfig from '../config';

const { apiUrl } = appConfig;

const NOTIFICATIONS = [
  {
    id: 0,
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    sent_at: new Date(),
    seen: false,
  },
  {
    id: 1,
    message:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur',
    sent_at: new Date(),
    seen: true,
  },
  {
    id: 2,
    message: 'I have got a great news for you!',
    sent_at: new Date(),
    seen: false,
  },
];

// mock midleware while we do not have a backend.
export const mockApi = axios.create({
  withCredentials: false,
  timeout: 20000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
});
const mockAdapter = new MockAdapter(mockApi, { delayResponse: 400 });

// mocking getNotification api
mockAdapter.onGet(`${apiUrl}/notifications/`).reply((config) => {
  console.log({ config });
  const response = 200;
  const data = NOTIFICATIONS;

  return [response, data];
});

// mocking seeNotification api
mockAdapter.onGet(`${apiUrl}/notifications/see`).reply((config) => {
  //   const { notificationLinkId } = JSON.parse(config.data);
  console.log({ config });
  const data = {};
  const responseStatus = 200;
  return [responseStatus, data];
});

// mocking getHasUnseen api
mockAdapter.onGet(`${apiUrl}/notifications/has_unseen`).reply(() => {
  const data = {
    hasUnseen: true,
  };
  const responseStatus = 200;

  return [responseStatus, data];
});

// mocking deleteNotification api
mockAdapter.onDelete(`${apiUrl}/notifications/delete`).reply(() => {
  const data = {};
  const responseStatus = 200;

  return [responseStatus, data];
});
