export default (pwString) => {
  var strength = 0,
    res = "";

  strength += /[A-Z]+/.test(pwString) ? 1 : 0;
  strength += /[a-z]+/.test(pwString) ? 1 : 0;
  strength += /[0-9]+/.test(pwString) ? 1 : 0;
  strength += /[\W]+/.test(pwString) ? 1 : 0;

  switch (strength) {
    case 3:
      // its's medium!
      res = {
        type: "medium",
        message: "Medium password",
      };
      break;
    case 4:
      // it's strong!
      res = {
        type: "strong",
        message: "Strong password",
      };
      break;
    default:
      // it's weak!
      res = {
        type: "weak",
        message: "Weak password",
      };
      break;
  }

  return res;
};
