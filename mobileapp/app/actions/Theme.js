export const ON_SWITCHING_THEME = 'ON_SWITCHING_THEME';
export const ON_SET_ACCENT_COLOR = 'ON_SET_ACCENT_COLOR';
export const ON_SET_PRIMARY_COLOR = 'ON_SET_PRIMARY_COLOR';

export const onSwitchingTheme = theme => {
  return {
    type: ON_SWITCHING_THEME,
    theme,
  };
};

export const onSetPrimaryColor = payload => {
  return {
    type: ON_SET_PRIMARY_COLOR,
    payload,
  };
};

export const onSetAccentColor = payload => {
  return {
    type: ON_SET_ACCENT_COLOR,
    payload,
  };
};