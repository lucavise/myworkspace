import React from "react";

export function useUserLiferay() {

  const [user, setUser] = React.useState({"userid": "", "username": "", "email": ""});

  React.useEffect(() => {
    const companyId = window.themeDisplay.getCompanyId();
    getUserLogged(companyId, setUser)
  }, []);
  return { user };
}

const getUserLogged = (companyId, setUser) => {
  const userid = window.themeDisplay.getUserId();
  const email = window.themeDisplay.getUserEmailAddress();
  const username = window.themeDisplay.getUserName();
  setUser({"userid": userid, "username": username, "email": email});
}