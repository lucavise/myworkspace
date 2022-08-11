import React from "react";

export function useUserLiferay() {

  const [loggedUser, setLoggedUser] = React.useState({});
  const [userId, setUserId] = React.useState();
  const [userAuthToken, setUserAuthToken] = React.useState("");
  console.log(Liferay.authToken);

  React.useEffect(() => {
    setUserAuthToken(Liferay.authToken);
  }, [Liferay.authToken]);

  return { userAuthToken };
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