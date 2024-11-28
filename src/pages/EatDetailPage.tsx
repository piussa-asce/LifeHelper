import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Footer from '../components/general/Footer';
import Header from '../components/general/Header';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Restaurant } from '../components/shared-preferences';
import './EatDetailPage.css';


const Home: React.FC = () => {

  let location = useLocation();

  return (
    <IonPage>

      <IonHeader>
          <IonToolbar>
            <Header/>
          </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="container">
          <p>#{location.state.id}</p>
          <p>Restaurant: {location.state.name}</p>
          <p>Type: {location.state.type}</p>
          <p>Location: {location.state.location}</p>
          <p>Date: {location.state.date}</p>
          <p>Aesthetics: V {location.state.vascoAesthetic} L {location.state.laraAesthetic}</p>
          <p>Taste: V {location.state.vascoTaste} L {location.state.laraTaste}</p>
          <p>Vibes: V {location.state.vascoVibes} L {location.state.laraVibes}</p>
          <p>Price: {location.state.price}€</p>
          <p>Comment: "{location.state.comment}"</p>
          <p>Return: {location.state.return ? 'Yes' : 'No'}</p>
        </div>
        <div className='button-container'>
          <button>DELETE</button>
          <button>EDIT</button>
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