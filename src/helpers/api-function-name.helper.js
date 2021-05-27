export const apiFunctionWithUniqName = async (functionName) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: ``,
  };
};

export const apiFunctionWithUniqNameChannels = async (functionName, longitude, latitude) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: `<valRoot><val> POINT(${longitude} ${latitude}) </val></valRoot>`,
  };
};
