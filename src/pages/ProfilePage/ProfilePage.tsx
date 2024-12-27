import React from "react";
import UpdateUserForm from "../../components/ProfilePage/UpdateUserForm/UpdateUserForm";
import Header from "../../components/Shared/Header/Header";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  return (
  <>
    <Header />
    <div className="profile-page-container">
      <div className="profile-page-content">
        <div className="profile-info">
            <h1 className="profile-title">Profile Information</h1>
            <UpdateUserForm />
          </div>
      </div>
    </div>
  </>
    
  );
};

export default ProfilePage;
