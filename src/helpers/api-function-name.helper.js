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

export const dataRecordPayment = ({
  accountNumber,
  paymentStatus,
  paymentAmount,
  channelRef,
  paymentRef,
}) => {
  return `<Objects><Account_Payment><F1>${accountNumber}</F1><F2>${paymentAmount}</F2><F3>${channelRef}</F3><F4>${new Date()}</F4><F5>${paymentRef}</F5><F6>${paymentStatus}</F6></Account_Payment></Objects>`;
};

export const userSharedAppData = ({ userId }) => {
  return `<User_Activity><F1>${userId}</F1><F2>Shared App</F2><F3>${new Date()}</F3></User_Activity>`;
};

export const dataUpdateNotificationToken = async (token, deviceID) => {
  return {
    taskID: 0,
    uniqName: 'update_notification_token',
    InputValues: `<valRoot><val>${token}</val><val>${deviceID}</val></valRoot>`,
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

export const dataInitiatePayment = async (functionName, accountNumber, amount) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: `<valRoot><val>${accountNumber}</val><val>${amount}</val></valRoot>`,
  };
};

export const notificationActivityData = ({ notificationId, userId, action, dateTime }) =>
  `<Objects><User_Notification_Activity><F1>${notificationId}</F1><F2>${userId}</F2><F3>${action}</F3><F4>${dateTime}</F4></User_Notification_Activity></Objects>`;

export const createNotificationActivityData = ({
  title,
  description,
  interestTypeRef,
  channelRef,
}) =>
  `<Notifications><F2>${title}</F2><F3>${description}</F3><F5>${channelRef}</F5><F6>${interestTypeRef}</F6></Notifications>`;

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

export const dataDeleteServiceRequest = ({ channelId, serviceRequestId }) => {
  return `<Objects><ServiceRequest><ObjectId>${serviceRequestId}</ObjectId><F19>${channelId}</F19><F33>T</F33></ServiceRequest></Objects>`;
};

export const dataServiceRequestComments = (serviceRequestId) => {
  return {
    taskID: 0,
    uniqName: 'get_service_request_comments',
    InputValues: `<valRoot><val>${serviceRequestId}</val></valRoot>`,
  };
};

export const dataNewComment = (serviceRequestId, comment) => {
  return `<Objects><Service_Request_Comment><F1>${serviceRequestId}</F1><F2>User</F2><F3>${comment}</F3></Service_Request_Comment></Objects>`;
};

export const dataConfirmAttachementsUploaded = ({ uploadCompleted, serviceRequestId }) => {
  return `<Objects><ServiceRequest><ObjectId>${serviceRequestId}</ObjectId><F37>${uploadCompleted}</F37></ServiceRequest></Objects>`;
};

export const dataFollowServiceRequest = ({ userId, serviceRequestId, followed }) => {
  return `<Objects><Service_Request_Follow><F1>${serviceRequestId}</F1><F2>${userId}</F2><F3>${
    followed ? 'T' : 'F'
  }</F3></Service_Request_Follow></Objects>`;
};

export const dataGetMeterReadings = ({ meterObjId }) => {
  return {
    taskID: 0,
    uniqName: 'get_meter_readings',
    InputValues: `<valRoot><val>${meterObjId}</val></valRoot>`,
  };
};

export const dataSubmitReading = ({ channelRef, meterObjId, readingValue, readingDate }) => {
  return `<Objects><Meter_Reading><F1>${meterObjId}</F1><F2>${readingValue}</F2><F7>${channelRef}</F7><F4>${readingDate}</F4></Meter_Reading></Objects>`;
};

export const dataValidateReading = ({ meterObjId, readingValue }) => {
  return {
    taskID: 0,
    uniqName: 'validate_meter_reading',
    InputValues: `<valRoot><val>${meterObjId}</val><val>${readingValue}</val></valRoot>`,
  };
};

export const dataNearbyPinLocations = (currentLatitude, currentLongitude) => {
  return {
    taskID: 0,
    uniqName: 'get_all_service_requests_by_location',
    InputValues: `<valRoot> <val>POINT(${currentLongitude} ${currentLatitude})</val></valRoot>`,
  };
};

export const dataNewsfeedReactions = (newsfeedRefNr) => {
  return {
    taskID: 0,
    uniqName: 'get_newsfeed_liked_disliked_totals',
    InputValues: `<valRoot><val>${newsfeedRefNr}</val></valRoot>`,
  };
};

export const dataUserReactionsToNewsfeeds = (newsfeedRefNr, userId) => {
  return {
    taskID: 0,
    uniqName: 'get_user_last_reaction',
    InputValues: `<valRoot><val>${newsfeedRefNr}</val><val>${userId}</val></valRoot>`,
  };
};
