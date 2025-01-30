import './Footer.css';
import React from 'react';
import { useHistory } from "react-router-dom";

interface ContainerProps { }

const Footer: React.FC<ContainerProps> = () => {
  let history = useHistory();
  return (
    <div id="container">
      <img src="/img/home/home-icon.svg" alt="Home Icon" width="30" height="30" onClick={() => history.push('/home')}/>
    </div>
  );
};

export default Footer;