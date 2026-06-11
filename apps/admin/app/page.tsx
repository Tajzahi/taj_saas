"use client";

import { useEffect, useState } from "react";
import LoginPage from "../components/LoginPage";
import Dashboard from "../components/Dashboard";
import { useAdminStore } from "../store/adminStore";

export default function AdminAppPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      setUsername(storedUser);
      setIsLoggedIn(true);
      
      // Also ensure mock shift is opened if not already
      const activeShift = useAdminStore.getState().activeShift;
      if (!activeShift) {
        useAdminStore.getState().openShift(200000, storedUser);
      }
    }
    setIsCheckingSession(false);
  }, []);

  const handleLogin = (user: string) => {
    localStorage.setItem("admin_user", user);
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    setIsLoggedIn(false);
    setUsername("");
    // Clear active shift locally too
    useAdminStore.setState({ activeShift: null });
  };

  if (isCheckingSession) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{
          background:
            "linear-gradient(135deg, #8E0E0E 0%, #D94708 60%, #E05009 100%)",
        }}
      >
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
        <p className="font-black tracking-wider text-xs">
          MEMUAT PORTAL OPERASIONAL...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} username={username} />;
}
