import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Footer from '../components/general/Footer';
import Header from '../components/general/Header';
import NewEat from '../components/eatlist/NewEat';

const Home: React.FC = () => {
  return (
    <IonPage>

      <IonHeader>
          <IonToolbar>
            <Header/>
          </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <NewEat />
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