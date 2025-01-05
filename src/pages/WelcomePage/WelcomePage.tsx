import React, { useState } from "react";
import "./WelcomePage.css";
import logo from "../../assets/images/logo.png";
import Welcome from "../../components/WelcomePage/Welcome/Welcome";
import CreateProfile from "../../components/WelcomePage/CreateProfile/CreateProfile";
import AccessAccount from "../../components/WelcomePage/AccessAccount/AccessAccount";

interface WelcomePageProps {}

const WelcomePage: React.FC<WelcomePageProps> = () => {
  const [currentView, setCurrentView] = useState<
    "welcome" | "createProfile" | "accessAccount"
  >("welcome");

  const handleCreateProfile = () => {
    setCurrentView("createProfile");
  };

  const handleAccessAccount = () => {
    setCurrentView("accessAccount");
  };

  const handleWelcome = () => {
    setCurrentView("welcome");
  };

  return (
    <div className="welcome-page">
      <div className="container">
        <div className="window">
          <header className="header">
            <img src={logo} alt="Expense Tracker Logo" className="logo" />
            <h1>
              {currentView === "welcome" && "Welcome to Expense Tracker"}
              {currentView === "createProfile" && "Create Your Profile"}
              {currentView === "accessAccount" && "Access Your Account"}
            </h1>
          </header>

          <div className="content">
            {currentView === "welcome" && (
              <Welcome
                onHandleCreateProfile={handleCreateProfile}
                onHandleAccessAccount={handleAccessAccount}
              />
            )}
            {currentView === "createProfile" && (
              <CreateProfile handleAccessAccount={handleAccessAccount} />
            )}
            {currentView === "accessAccount" && (
              <AccessAccount handleCreateProfile={handleCreateProfile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
