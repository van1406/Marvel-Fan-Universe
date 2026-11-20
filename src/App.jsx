import { useState } from "react";
import ParticleBackground from "./components/ParticleBackground";
import AuthPage from "./components/AuthPage";
import MarvelIntro from "./components/MarvelIntro";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [screen, setScreen] = useState("auth"); // 'auth' | 'intro' | 'dashboard'
  const [user, setUser] = useState(null);

  const handleAuth = (userData) => {
    setUser(userData);
    setScreen("intro");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("auth");
  };

  if (screen === "dashboard") {
    return <Dashboard onLogout={handleLogout} user={user} onUserUpdate={setUser} />;
  }

  if (screen === "intro") {
    return (
      <MarvelIntro
        onComplete={() => setScreen("dashboard")}
        onSkip={() => setScreen("dashboard")}
      />
    );
  }

  return (
    <>
      <ParticleBackground />
      <AuthPage
        onLoginSuccess={() => setScreen("intro")}
        onLogin={handleAuth}
        onSignUp={handleAuth}
      />
    </>
  );
}
