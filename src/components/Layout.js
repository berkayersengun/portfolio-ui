import React from "react";
import Header from "./Header";
import Overview from "./Overview";

function Layout({
  children,
  type,
  setType,
  setExpanded,
  loginInfo,
  portfolio,
  setLoginInfo,
}) {
  return (
    <>
      <Header
        {...{ type, setType, setExpanded, timerId: loginInfo.timerId }}
      ></Header>
      <Overview {...{ type, portfolio, loginInfo, setLoginInfo }}></Overview>
      <main>{children}</main>
    </>
  );
}

export default Layout;
