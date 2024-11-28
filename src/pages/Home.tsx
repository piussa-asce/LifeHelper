import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import HomePage from '../components/home/HomePage';
import Footer from '../components/general/Footer';
import Header from '../components/general/Header';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
          <IonToolbar>
            <Header/>
          </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <HomePage />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <Footer/>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
