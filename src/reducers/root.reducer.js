import { combineReducers } from 'redux';

import userAuthReducer from './user-auth-reducer/user-auth.reducer';
import userReducer from './user-reducer/user.reducer';
import accountsPropertyReducer from './accounts-reducer/accountProperties.reducer';
import accountsReducer from './accounts-reducer/accounts.reducer';
import serviceRequestReducer from './service-request-reducer/service-request.reducer';
import locationReducer from './location-reducer/location.reducer';
import municipalitiesReducer from './municipalities-reducer/municipalities.reducer';
import newsFeedsReducer from './news-feed-reducer/news-feed.reducer';
import myChannelsReducer from './my-channels/my-channels.reducer';
import unsubscribedChannelsReducer from './unsubscribed-channels/unsubscribed-channels.reducer';
import notificationReducer from './notification-reducer/notification.reducer';
import contactsReducer from './contacts-reducer/contacts.reducer';

export default combineReducers({
  userAuthReducer,
  userReducer,
  accountsPropertyReducer,
  accountsReducer,
  serviceRequestReducer,
  locationReducer,
  municipalitiesReducer,
  newsFeedsReducer,
  myChannelsReducer,
  unsubscribedChannelsReducer,
  notificationReducer,
  contactsReducer,
});
