import React from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import FacebookLoginButton from "./FacebookLoginButton";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function LoginPage() {
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const res = await fetch('/api/users/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    console.log(data);
  };

  const handleFacebookLogin = async ({ facebookId, name, email }) => {
    const res = await fetch('/api/users/auth/facebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facebookId, name, email })
    });
    const data = await res.json();
    console.log(data);
  };

  const handleLoginSuccess = () => {
    window.location.href = "/"; // أو أي صفحة بعد تسجيل الدخول
  };

  return (
    <div>
      <h2>تسجيل الدخول</h2>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
      <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={() => alert('فشل تسجيل الدخول عبر Google')} />
      <FacebookLoginButton onLogin={handleFacebookLogin} />
      <hr />
      <RegisterForm />
    </div>
  );
}
