const axios = require("axios");

const sendSms = async(phone, message) => {
  const BASE_URL = `http://rslr.connectbind.com:8080/bulksms/bulksms?username=la15-lapp&password=Wed@1234&type=0&dlr=1&destination=${phone.replace(
    "+",
    ""
  )}&source=Skol&message=${message}`;

  const options = {
    method: "GET",
    url: BASE_URL,
  };

 return await axios(options)
    .then((data) => {
      return {
        success: true,
        message: "Message sent to " + phone,
        providerMessage:data.data
      };
    })
    .catch((error) => {
      return {
        success: true,
        message: "Message sent failed ",
        error,
      };
    });
};

module.exports = { sendSms };
