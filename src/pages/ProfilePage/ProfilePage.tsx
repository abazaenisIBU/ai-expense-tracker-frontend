import React, { useEffect } from "react";
import { useUser } from "../../context/UserContext"; // Import the useUser hook

const ProfilePage: React.FC = () => {
  const { user } = useUser(); // Access the user from the global state

  useEffect(() => {
    if (user) {
      console.log("User Details:", user); // Log the user details
    } else {
      console.log("No user is logged in.");
    }
  }, [user]); // Trigger effect when the user changes

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to your profile!</h1>
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
  );
};

export default ProfilePage;
