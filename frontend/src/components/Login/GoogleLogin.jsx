import React, { useContext } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import LoginStatusContext from "../../contexts/LoginStatusContext";

const CLIENT_ID =
  "942647210382-bc35483ltee87aoa4qg03o1sbj8eb61o.apps.googleusercontent.com";
const GoogleLoginBtn = ({ onGoogleLogin }) => {
  const { setLoginStatus } = useContext(LoginStatusContext);
  const navigate = useNavigate();

  const onSuccess = async (response) => {
    console.log(response);
    const {
      googleId,
      profileObj: { email, name },
    } = response;

    // const onGoogleLogin =await () => {
    setLoginStatus("2");
    navigate("/");
    // };
  };

  const onFailure = (error) => {
    console.log(error);
  };
  return (
    <div>
      <GoogleLogin
        clientId={CLIENT_ID}
        responseType={"id_token"}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
};

export default GoogleLoginBtn;
