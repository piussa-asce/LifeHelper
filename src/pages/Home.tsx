import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Footer from '../components/general/Footer';
import Header from '../components/general/Header';
import './Home.css';
import { useHistory } from 'react-router';

const Home: React.FC = () => {

  let history = useHistory();
  return (
    <IonPage className='page'>
      <IonHeader>
          <Header/>
      </IonHeader>
      <IonContent fullscreen>
          <div id="home-page">
            <h1 id="welcome-message">Welcome back,</h1>
            <div id="home-list">
              <a className="buttons" href='/eatlist'>EAT LIST</a>
              <a className="buttons" href="/fittracker">FIT TRACKER</a>
              <a className="buttons">NOTES</a>
              <a className="buttons">BUDGET</a>
              <a className="buttons">WORK AGENDA</a>
              <a className="buttons">FILLER</a>
            </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
