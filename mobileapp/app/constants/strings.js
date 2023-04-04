export const APP_NAME = 'skol-survey';
export const GOOGLE_PLAY_STORE =
  'https://play.google.com/store/apps/details?id=com.skolsurvey';

export const APPLE_STORE = '';
export const APP_ID = '63fdf074095f8bc0e023ee15';
export const ORGANIZATION_NAME = 'Skol';
export const GOOGLE_API = 'AIzaSyC_Mjs-z9BUQeDKE9rc_lH5HGMCiWTGAmw';
export const URL = 'http://46.101.4.41:5000';
export const ROOT_API = URL + '/api/v1';

export const survey_loader = [
  {
    title: '',
    description: '',
  },
  {
    title: '',
    description: '',
  },
  {
    title: '',
    description: '',
  },
  {
    title: '',
    description: '',
  },
  {
    title: '',
    description: '',
  },
  {
    title: '',
    description: '',
  },
  {
    title: '',
    description: '',
  },
  {
    title: '',
    description: '',
  },
  {
    title: '',
    description: '',
  },
];

export const USER_PHOTO_PLACEHOLDER =
  'https://res.cloudinary.com/dwqhmch33/image/upload/v1668719695/harakameds/assets/user_placeholder.webp';

export const DEFAULT_IMAGE_PLACEHOLDER =
  'https://res.cloudinary.com/dwqhmch33/image/upload/v1677876761/skol/default-image_placeholder.png';

export const ONBOARD_IMAGE_ONE =
  'https://res.cloudinary.com/dwqhmch33/image/upload/v1675955384/skol/onboard-001.png';

export const ONBOARD_IMAGE_TWO =
  'https://res.cloudinary.com/dwqhmch33/image/upload/v1675957633/skol/winnerimage.png';

export const ONBOARD_IMAGE_THREE =
  'https://res.cloudinary.com/dwqhmch33/image/upload/v1675958433/skol/charts.png';

export const ACCESS = [
  {
    label: 'Super Admin',
    value: 'super_admin',
    permission: ['super_admin'],
  },
  {
    label: 'Admin',
    value: 'admin',
    permission: ['super_admin', 'admin'],
  },
  {
    label: 'Surveyor',
    value: 'sub_admin',
    permission: ['super_admin', 'admin'],
  },
];
