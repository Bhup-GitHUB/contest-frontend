"use client";

import React, { useState, useEffect } from "react";
import BasicSignup from "@/components/auth/basic-signup";
import Login from "@/components/auth/login";
import Dashboard from "@/components/dashboard/dashboard";
import AdminPanel from "@/components/admin/admin-panel";
import ContestDetail from "@/components/contest/contest-detail";
import UserProfile from "@/components/profile/user-profile";

type View = "login" | "signup" | "dashboard" | "admin" | "contest" | "profile";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("login");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);

  // Check for stored auth data on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setCurrentView("dashboard");
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
  }, []);

  const handleAuthSuccess = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    setCurrentView("dashboard");
    
    // Store auth data in localStorage
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentView("login");
    setSelectedContestId(null);
    
    // Clear stored auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  const switchToSignup = () => setCurrentView("signup");
  const switchToLogin = () => setCurrentView("login");
  const switchToDashboard = () => setCurrentView("dashboard");
  const switchToAdmin = () => setCurrentView("admin");
  const switchToProfile = () => setCurrentView("profile");
  
  const viewContest = (contestId: string) => {
    setSelectedContestId(contestId);
    setCurrentView("contest");
  };

  const backToDashboard = () => {
    setSelectedContestId(null);
    setCurrentView("dashboard");
  };

  // Render appropriate component based on current view
  if (currentView === "dashboard" && user && token) {
    return (
      <Dashboard 
        user={user} 
        token={token} 
        onLogout={handleLogout}
        onViewContest={viewContest}
        onViewProfile={switchToProfile}
        onViewAdmin={switchToAdmin}
      />
    );
  }

  if (currentView === "admin" && user && token) {
    return (
      <AdminPanel 
        user={user} 
        token={token} 
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === "contest" && user && token && selectedContestId) {
    return (
      <ContestDetail 
        contestId={selectedContestId}
        user={user} 
        token={token} 
        onBack={backToDashboard}
      />
    );
  }

  if (currentView === "profile" && user && token) {
    return (
      <UserProfile 
        user={user} 
        token={token} 
        onBack={backToDashboard}
      />
    );
  }

  if (currentView === "signup") {
    return <BasicSignup onSuccess={handleAuthSuccess} />;
  }

  return <Login onSuccess={handleAuthSuccess} onSwitchToSignup={switchToSignup} />;
}
