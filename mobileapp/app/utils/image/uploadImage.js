import axios from 'axios';
import {ROOT_API} from '../../constants/strings';
import toastMessage from '../toastMessage';
import {removeTMPImage} from './imageUploadHandler';

export default async (file, token) => {
  const formData = new FormData();

  formData.append('file0', file);

  const options = {
    method: 'POST',
    url: `${ROOT_API}/file/upload`,
    data: formData,
    headers: {
      authorization: 'Bearer ' + token,
      'Content-type': 'multipart/form-data',
    },
  };

  const data = await axios(options);

  removeTMPImage(file.path); //clean up the TMP

  if (data.data.error) {
    toastMessage(data.data.error);

    return;
  }

  const {file_url, public_id} = data.data;

  return file_url;
};
