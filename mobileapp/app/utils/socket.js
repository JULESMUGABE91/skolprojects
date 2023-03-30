// window.navigator.userAgent = 'react-native';
import io from 'socket.io-client';

const socket = io.connect('http://146.190.152.81:9000', {
  transports: ['websocket'],
});

socket.on('connect', socket => {
  console.log('****************************** socket connected successful');
});

socket.on('connect_error', err => {
  console.log(`*******************************connect_error due to ${err}`);
});

export default socket;
