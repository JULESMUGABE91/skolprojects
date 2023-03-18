import React from "react";
import { getStorage } from "../utils/storage";
import logo from "../assets/logo.png";

class SplashScreen extends React.Component {
  componentDidMount = async () => {
    const user = await getStorage();

    setTimeout(() => {
      if (user.token) {
        return (window.location.href = "/dashboard/home");
      }

      window.location.href = "/login";
    }, 3000);
  };
  render() {
    return (
      <div className="splash">
        <img src={logo} />
      </div>
    );
  }
}

export default SplashScreen;
