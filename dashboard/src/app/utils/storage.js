import { APP_NAME } from "../constants/strings";

export const setStorage = async (data) =>
  await localStorage.setItem(APP_NAME, JSON.stringify(data));

export const getStorage = async () => {
  const user = await JSON.parse(localStorage.getItem(APP_NAME));

  return user ? user : {};
};

export const clearStorage = async () => {
  const user = await localStorage.clear();

  return user ? user : {};
};
