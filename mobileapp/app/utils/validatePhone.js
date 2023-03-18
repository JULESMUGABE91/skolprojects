export default phone => {
  var isValid = false,
    isNum = /^\d+$/.test(phone);

  if (phone.length >= 9 && isNum) {
    isValid = true;
  }

  return isValid;
};
