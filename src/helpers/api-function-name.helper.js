export const apiFunctionWithUniqName = async (functionName) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: ``,
  };
};

export const dataGetAccounts = async (functionName, data) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: `<valRoot><val>${data.firstName}</val><val>${data.lastName}</val><val>${data.idNumber}</val><val>${data.telNumber}</val><val>${data.mobileNumber}</val></valRoot>`,
  };
};

export const dataValidateAccount = async ({ channelId, accountNumber }) => {
  return {
    taskID: 0,
    uniqName: 'validate_account_no',
    InputValues: `<valRoot><val>${accountNumber}</val><val>${channelId}</val></valRoot>`,
  };
};

export const dataUpdateUserProfile = async (functionName, data) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: `<valRoot><val>${data.name}</val><val>${data.lastName}</val><val>${data.idNumber}</val><val>${data.telNumber}</val><val>${data.mobileNumber}</val></valRoot>`,
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

export const dataCreateRecord = ({ userId, channelId, accountNumber, status }) => {
  return `<Objects><User_Account><F1>${userId}</F1><F2>${channelId}</F2><F3>${accountNumber}</F3><F4>${status}</F4></User_Account></Objects>`;
};
