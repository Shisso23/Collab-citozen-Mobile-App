import _ from 'lodash';
import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  userUrl: () => `${apiUrl}/users`,
  avatarUrl: `https://loremflickr.com/320/240/landscape?random=${_.random(1000)}`,
};
