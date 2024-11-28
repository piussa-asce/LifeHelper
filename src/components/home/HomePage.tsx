import './HomePage.css';
import React from 'react';
import { useHistory } from "react-router-dom";

interface ContainerProps { }

const HomePage: React.FC<ContainerProps> = () => {

  let history = useHistory();
  return (
    <div>
      <h1 id="welcome-message">Welcome back,</h1>
      <div id="home-list">
        <button id="buttons" onClick={() => history.push('/eatlist')}>EAT LIST</button>
        <button id="buttons">TASKS</button>
        <button id="buttons">LOGS</button>
        <button id="buttons">SPORTS TRACKER</button>
        <button id="buttons">BUDGET</button>
        <button id="buttons">NOTES</button>
      </div>
    </div>
  
  );
};

export default HomePage;
