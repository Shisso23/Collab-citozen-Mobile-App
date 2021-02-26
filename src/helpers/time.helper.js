import moment from 'moment';

export const formatTime = (timestamp) => (timestamp ? moment(timestamp).format('YYYY/MM/DD') : '');

export const apiFormatTime = (timestamp) =>
  timestamp ? moment(timestamp).format('YYYY/MM/DD hh:mm') : '';
