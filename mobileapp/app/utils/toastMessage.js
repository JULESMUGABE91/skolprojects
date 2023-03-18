import Toast from 'react-native-simple-toast';
export default message => {
  console.log('Message******' + message);
  console.log(message);
  return message && message.response && message.response.status !== 404
    ? Toast.show(
        message.response.data.message
          ? message.response.data.message
          : message.response.data.message,
        Toast.LONG,
      )
    : typeof message === 'string' && Toast.show(message, Toast.LONG);
};
