import React from "react";
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
export default function GoogleLoginButton({ onSuccess, onError }) {
  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        // ترسل التوكن للباك اند
        onSuccess(credentialResponse);
      }}
      onError={() => {
        onError();
      }}
    />
  );
}
