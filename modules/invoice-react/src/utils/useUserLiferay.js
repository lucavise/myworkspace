import React from "react";

export function useUserLiferay() {

  const [userId, setUserId] = React.useState("");
  const [userAuthToken, setUserAuthToken] = React.useState("");

  React.useEffect(() => {
    console.log("eoraaaaa " + Liferay.authToken);
    setUserAuthToken(Liferay.authToken);
    setUserId(window.themeDisplay.getUserId());
  }, []);

  return userAuthToken;
}

const getloggedUser = (companyId, setUserId, setUserAuthToken) => {
  const userid = window.themeDisplay.getUserId();
  const email = window.themeDisplay.getUserEmailAddress();
  const username = window.themeDisplay.getUserName();
  let authToken = "";
  try {
    authToken = Liferay.authToken;
    console.log("p --> " + authToken);
  } catch (err) {
    authToken = "";
  }

  setUserId(userid);
  setUserAuthToken(authToken);
}