import React, { useState } from 'react';
import './HomePage.css';
import logo from "../../logo.png";
import Home from '../../components/HomePage/Home/Home';
import CreateProfile from '../../components/HomePage/CreateProfile/CreateProfile';
import AccessAccount from '../../components/HomePage/AccessAccount/AccessAccount';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [currentView, setCurrentView] = useState<'home' | 'createProfile' | 'accessAccount'>('home');

  const handleCreateProfile = () => {
    setCurrentView('createProfile');
  };

  const handleAccessAccount = () => {
    setCurrentView('accessAccount');
  };

  const handleHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="window">
          <header className="header">
            <img src={logo} alt="Expense Tracker Logo" className="logo" />
            <h1>
              {currentView === 'home' && 'Welcome to Expense Tracker'} 
              {currentView === 'createProfile' && 'Create Your Profile'} 
              {currentView === 'accessAccount' && 'Access Your Account'} 
            </h1> 
          </header>

          <div className="content">
            {currentView === 'home' && (
              <Home
                onHandleCreateProfile={handleCreateProfile}
                onHandleAccessAccount={handleAccessAccount}
              />
            )}
            {currentView === 'createProfile' && (
              <CreateProfile handleAccessAccount={handleAccessAccount} />
            )}
            {currentView === 'accessAccount' && (
              <AccessAccount handleCreateProfile={handleCreateProfile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;