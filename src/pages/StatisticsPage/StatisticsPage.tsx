import React, { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Header from "../../components/Shared/Header/Header";
import Statistics from "../../components/StatisticsPage/Statistics";
import "./StatisticsPage.css";

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
    <>
      <Header />
      <div className="statistics-page-container">
        <div className="statistics-page-content">
          <div className="statistics-info">
            <Statistics />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
