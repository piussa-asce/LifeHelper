import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import Footer from '../../components/general/Footer';
import Header from '../../components/general/Header';

import './AddEat.css';

import React, { useRef, useState } from 'react';
import { addRestaurant, RESTAURANTS_KEY } from '../../shared-preferences/eatlist';

const Home: React.FC = () => {
  function addNewEat(event: any) {
    event.preventDefault();
    const data = event.currentTarget.elements;
    let json = {
        id: 0,
        name: data.name.value,
        location: data.location.value,
        date: data.date.value,
        price: parseFloat(data.price.value),
        type: data.type.value,
        vascoVibes: parseInt(data.vascovibes.value),
        vascoTaste: parseInt(data.vascotaste.value),
        vascoAesthetic: parseInt(data.vascoaesthetic.value),
        laraVibes: parseInt(data.laravibes.value),
        laraAesthetic: parseInt(data.laraaesthetic.value),
        laraTaste: parseInt(data.larataste.value),
        comment: data.comment.value,
        return: data.return.checked
    };
    addRestaurant(json);
    window.location.href = "/eatlist";
  }
  return (
    <IonPage>

      <IonHeader>
        <Header/>
      </IonHeader>
    
        <IonContent fullscreen>

        <div className='addeat-page'>
          <div className='title-message'>WHERE DID YOU GO?</div>
          <form onSubmit={addNewEat}>
              
              <section className='row'>
                  <div className="element">
                      <label htmlFor="name">Name</label>
                      <input type="text" name='name' id='name' placeholder='Restaurant'/>
                  </div>
                  <div className='element'>
                      <label htmlFor="type">Type</label>
                      <input type="text" name="type" id="type" placeholder='Sushi, mexican, ...' />
                  </div>
              </section>
              <section className='row'>
                  <div className='element'>
                      <label htmlFor="location">Location</label>
                      <input type="text" name="location" id="location" placeholder='City, town, place'/>
                  </div>
                  <div className='element'>
                      <label htmlFor="date">Date</label>
                      <input type="date" name="date" id="date" />
                  </div>
              </section>
              <section className='atv'>
                  <div className='col'>
                      <label htmlFor="" className='atv-label'>Vibes</label>
                      <input className="atv-input" type="number" name="vascovibes" id="vascovibes" placeholder="V" min={0} max={10} step={0.5}/>
                      <input className="atv-input" type="number" name="laravibes" id="laravibes" placeholder="L" min={0} max={10} step={0.5}/>
                  </div>
                  <div className='col'>
                      <label htmlFor="" className='atv-label'>Aesthetic</label>
                      <input className="atv-input" type="number" name="vascoaesthetic" id="vascoaesthetic" placeholder="V" min={0} max={10} step={0.5}/>
                      <input className="atv-input" type="number" name="laraaesthetic" id="laraaesthetic" placeholder="L" min={0} max={10} step={0.5}/>
                  </div>
                  <div className='col'>
                      <label htmlFor="" className='atv-label'>Taste</label>
                      <input className="atv-input" type="number" name="vascotaste" id="vascotaste" placeholder="V" min={0} max={10} step={0.5}/>
                      <input className="atv-input" type="number" name="larataste" id="larataste" placeholder="L" min={0} max={10} step={0.5}/>
                  </div>
              </section>
              <textarea name="comment" id="comment" placeholder='Leave a comment...'></textarea>
              <section className='row'>
                  <div className='element'>
                      <label htmlFor="price">Price</label>
                      <input type="number" name="price" id="price" placeholder='€€' step={0.01} min={0}/>
                  </div>
                  <div className='ret'>
                      <label htmlFor="checkbox">Would you Return?</label>
                      <input type="checkbox" name="return" id="return" />
                  </div>
              </section>
              <div className='center'>
                  <input type="submit" name="submit" id="submit" value={"SAVE"}/>
              </div>
          </form>
        </div>
        </IonContent>

    </IonPage>
  );
};

export default Home;