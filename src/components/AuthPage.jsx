import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function AuthPage({ onLoginSuccess, onLogin, onSignUp }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/Marvel-Logo.jpg" alt="MARVEL" />
        </div>

        {/* Title */}
        <h1 className="auth-title">
          {mode === "login" ? "Welcome Back" : "Join the Universe"}
        </h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Sign in to access your Marvel universe"
            : "Create your Marvel account"}
        </p>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {mode === "login" ? (
          <LoginForm
            onSwitch={() => setMode("signup")}
            onLoginSuccess={onLoginSuccess}
            onLogin={onLogin}
          />
        ) : (
          <SignUpForm onSwitch={() => setMode("login")} onSignUp={onSignUp} />
        )}
      </div>
    </div>
  );
}
