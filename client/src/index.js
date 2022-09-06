import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-3iuna5ox.us.auth0.com"
    clientId={process.env.REACT_APP_AUTH_ClIENT_ID}
    redirectUri={window.location.origin}
    // useRefreshTokens={true}
    cacheLocation={"localstorage"}
  >
    <App />
  </Auth0Provider>
);
