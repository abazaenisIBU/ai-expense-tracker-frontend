import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import "./Header.css";
import defaultUserProfilePicture from "../../../assets/images/default-user.png";
import logo from "../../../assets/images/logo.png";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const { user } = useUser();

  const defaultProfilePicture = defaultUserProfilePicture;

  return (
    <header className="header-container">
      <div className="header-logo" onClick={() => navigate("/home")}>
        <img src={logo} alt="Expense Tracker Logo" className="header-logo-image" />
      </div>
      <nav className="header-nav">
        <a
          onClick={() => navigate("/home")}
          className={`header-link ${location.pathname === "/home" ? "active-link" : ""}`}
        >
          Home
        </a>
        <a
          onClick={() => navigate("/statistics")}
          className={`header-link ${location.pathname === "/statistics" ? "active-link" : ""}`}
        >
          Statistics
        </a>
        <a
          onClick={() => navigate("/profile")}
          className={`header-link ${location.pathname === "/profile" ? "active-link" : ""}`}
        >
          Profile
        </a>
      </nav>
      <div className="header-profile">
        <img
          src={user?.profilePicture || defaultProfilePicture}
          alt="Profile"
          className="header-profile-picture"
          onClick={() => navigate("/profile")}
        />
      </div>
    </header>
  );
};

export default Header;
