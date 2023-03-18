import { countries } from "../constants/countries";

export default (phone) => {
  var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return regex.test(phone);
};

export const getPhoneNumberComponent = (phone) => {
  let dial_code = "";
  let number = phone.replace(/\+/g, "");
  let country = {};
  let phone_number = "";

  if (number.substring(0) === "+") {
    console.log("start with plus");
  }

  if (phone_number === "") {
    phone_number = number.slice(0, 1) === "0" ? number.slice(1) : number;
  }

  if (phone.length >= 12) {
    for (let i = 0; i < countries.length; i++) {
      dial_code = number.slice(0, countries[i].value.length - 1);

      if ("+" + dial_code === countries[i].value) {
        country = countries[i];
        phone_number = number.slice(dial_code.length);
      }
    }
  }

  return {
    dial_code,
    country,
    number: phone_number,
  };
};
