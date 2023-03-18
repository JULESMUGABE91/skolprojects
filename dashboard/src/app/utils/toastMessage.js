import { toast } from "react-toastify";

export default function toastMessage(type = "error", message) {
  let new_message = message;
  if (message && message.response && message.response.data.error) {
    new_message = message.response.data.error;
  }
  if (
    message &&
    message.response &&
    message.response.data.error &&
    message.response.data.error.error
  ) {
    new_message = message.response.data.error.error;
  } else if (
    message &&
    message.response &&
    message.response.data &&
    message.response.data.error
  ) {
    new_message = message.response.data.error;
  } else if (
    message &&
    message.response &&
    message.response.data &&
    message.response.data.message
  ) {
    new_message = message.response.data.message;
  }
  return toast[type](new_message, {
    position: "bottom-right",
  });
}
