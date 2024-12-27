import React from 'react';

import "./Welcome.css";

interface WelcomeProps {
  onHandleCreateProfile: () => void;
  onHandleAccessAccount: () => void;
}

function Welcome({ onHandleCreateProfile, onHandleAccessAccount }: WelcomeProps) {
  return (
    <>
      <section className="features">
        <ul>
          <li><strong>Expense Categorization:&nbsp; </strong> Easily categorize your expenses into different groups.</li>
          <li><strong>Detailed Reports:&nbsp;</strong> Generate reports to understand your spending patterns over time.</li>
          <li><strong>Visualisation:&nbsp;</strong> Visualize your spending data with customizable charts and graphs.</li>
          <li><strong>AI-powered category prediction: &nbsp; </strong>AI analyzes your expenses and suggest categories</li>
        </ul>
      </section>
      <div className="buttons">
        <button onClick={onHandleCreateProfile}>Create Profile</button>
        <button onClick={onHandleAccessAccount}>Access Account</button>
      </div>
    </>
  );
}

export default Welcome;