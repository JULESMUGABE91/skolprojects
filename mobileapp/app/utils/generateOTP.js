export default len => {
  var code = Math.floor(100000 + Math.random() * 900000);
  code = String(code);
  code = code.substring(0, len);

  return code;
};
