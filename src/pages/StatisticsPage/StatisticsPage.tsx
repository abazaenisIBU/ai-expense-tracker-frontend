import React, { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Header from "../../components/Shared/Header/Header"; 

const ProfilePage: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("User Details:", user);
    } else {
      console.log("No user is logged in.");
    }
  }, [user]);

  return (
    <div>
      <Header />
      <div style={{ padding: "20px" }}>
        <h1>Welcome to your statistics page!"</h1>
        {user ? (
          <div>
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.profilePicture && (
              <p><strong>Profile Picture:</strong> <img src={user.profilePicture} alt="Profile" /></p>
            )}
            <p><strong>Account Created:</strong> {user.createdAt}</p>
            <p><strong>Last Updated:</strong> {user.updatedAt}</p>
          </div>
        ) : (
          <p>No user is logged in.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
