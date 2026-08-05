export const USER_TOKEN = "USER_TOKEN";
export const USER_DATA = "USER_DATA";

export const setUserData = (data) => ({
  type: USER_DATA,
  payload: data,
});

export const setUserToken = (data) => ({
  type: USER_TOKEN,
  payload: data,
});
