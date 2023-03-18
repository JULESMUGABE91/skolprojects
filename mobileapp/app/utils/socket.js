// window.navigator.userAgent = 'react-native';
import io from 'socket.io-client';
import {URL} from '../constants/strings';

const socket = io.connect(URL, {
  // transports: ['websocket'],
});

socket.on('connect', socket => {
  console.log('****************************** socket connected successful');
});

socket.on('connect_error', err => {
  console.log(`*******************************connect_error due to ${err}`);
});

export default socket;
