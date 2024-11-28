import './Header.css';

interface ContainerProps { }

const Header: React.FC<ContainerProps> = () => {
  return (
    <div id="header"><span id="app-name">LIFE HELPER</span></div>
  );
};

export default Header;