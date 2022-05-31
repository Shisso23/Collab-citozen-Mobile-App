import _ from 'lodash';

export const CreateNotificationModel = (createNotificationModel = {}) => ({
  title: _.get(createNotificationModel, 'title', ''),
  interestTypes: _.get(createNotificationModel, 'interestTypes', []),
  description: _.get(createNotificationModel, 'description', ''),
});

export const CreateNotificationApiModel = () => ({});
