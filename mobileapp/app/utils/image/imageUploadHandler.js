import ImagePicker from 'react-native-image-crop-picker';

export default async type => {
  let image = {};

  const options = {
    width: 300,
    height: 400,
    cropping: true,
  };

  if (type === 'camera') {
    image = await ImagePicker.openCamera(options);
  } else {
    image = await ImagePicker.openPicker(options);
  }

  let uriParts = image.path.split('.');
  let fileType = uriParts[uriParts.length - 1];

  return {
    uri: image.path,
    type: image.mime,
    path: image.path,
    size: image.size,
    name: `file.${fileType}`,
  };
};

export const removeTMPImage = path => {
  ImagePicker.cleanSingle(path)
    .then(() => {
      console.log('removed all tmp images from tmp directory');
    })
    .catch(e => {
      alert(e);
    });
};
