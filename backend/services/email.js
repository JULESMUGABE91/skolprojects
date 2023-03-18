const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const OAuth2 = google.auth.OAuth2;

require("dotenv");

const oauth2Client = new OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_SECRET,
  process.env.EMAIL_REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token:
    "1//04jQIlzusZZ8gCgYIARAAGAQSNwF-L9Ir7g1CEy6sDJboyVSmbHH8CszdiUtRNu0D0sXW9W3FR_QqZafPdcrpyjzKoPjoYFayHxk",
});
const accessToken = oauth2Client.getAccessToken();

const send = () => {
  // create mail transporter
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      type: process.env.EMAIL_TYPE,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  return transporter;
};

const sendEmail = async (params) => {
  const { to, subject, message } = params;

  try {
    let transporter = send(process.env.EMAIL_FROM, subject, message, to);

    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: message,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return {
          status: "failed",
          error,
        };
      }
      return {
        status: "success",
        error: null,
        message: "Email successfully sent!",
      };
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail, sendEmailTemplate };
