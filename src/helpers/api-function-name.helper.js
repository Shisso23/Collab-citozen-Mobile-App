export const apiFunctionWithUniqName = async (functionName) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: ``,
  };
};

export const notificationActivityData = ({ notificationId, userId, action, dateTime }) =>
  `<Objects><User_Notification_Activity><F1>${notificationId}</F1><F2>${userId}</F2><F3>${action}</F3><F4>${dateTime}</F4></User_Notification_Activity></Objects>`;

export const apiFunctionWithUniqNameChannels = async (functionName, longitude, latitude) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: `<valRoot><val> POINT(${longitude} ${latitude}) </val></valRoot>`,
  };
};
