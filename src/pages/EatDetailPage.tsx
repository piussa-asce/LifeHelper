import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Footer from '../components/general/Footer';
import Header from '../components/general/Header';
import NewEat from '../components/eatlist/NewEat';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Restaurant } from '../components/shared-preferences';


const Home: React.FC = () => {

  let location = useLocation();
  const [data, setData] = useState(location.state);
  console.log(data);

  return (
    <IonPage>

      <IonHeader>
          <IonToolbar>
            <Header/>
          </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="container">
          <p></p>
        </div>
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