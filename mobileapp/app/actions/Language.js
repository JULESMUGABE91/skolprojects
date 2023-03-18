export const ON_SWITCHING_LANGUAGE = 'ON_SWITCHING_LANGUAGE';

export const onSwitchLanguage = language => {
  return {
    type: ON_SWITCHING_LANGUAGE,
    language,
  };
};
