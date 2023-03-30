import { ACCESS } from "../../constants/strings";

export const setLevels = (account_type) => {
  let access_levels = [];

  for (let level of ACCESS) {
    if (level?.permission?.includes(account_type)) {
      access_levels.push(level);
    }
  }

  return access_levels;
};

export const setDefaultLevel = (account_type) => {
  let access_level = {};

  for (let level of ACCESS) {
    if (level?.value === account_type) {
      access_level = level;
    }
  }

  return access_level;
};
