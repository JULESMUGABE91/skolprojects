import axios from 'axios';
import {ROOT_API} from '../../constants/strings';

const formattedPhone = phone => {
  let formatted = phone;

  formatted = phone.replace('+', '');

  return formatted;
};

export const requestOTP = async ({error, phone}) => {
  console.log(error, phone);
  if (Object.keys(error).length === 0) {
    const formatted_phone = formattedPhone(phone);

    const options = {
      method: 'POST',
      url: `${ROOT_API}/user/phone-auth`,
      data: {
        phone: formatted_phone,
      },
    };
    return await axios(options);
  }
};
