import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import Footer from '../../components/general/Footer';
import Header from '../../components/general/Header';

import './AddEat.css';

import React, { useEffect, useRef, useState } from 'react';
import { editRestaurant, Restaurant } from '../../shared-preferences/eatlist';
import { useHistory, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

interface stateDetail {
  data: Restaurant,
  index: number
}

const EditEatPage: React.FC = () => {

    const location = useLocation();
    const [data, setData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const sp = new URLSearchParams(location.search);
        const json = sp.get("data");
        if (json) {
            try {
                setData(JSON.parse(json));
            } catch (error) {
                console.error("Failed to parse data:", error);
                setErrorMessage("Failed to parse data:" + error);
            }
        }
    }, [location.search])

    if (!data) {
        if (errorMessage == "") {
             return <p>Loading data...</p>;
        }
        return <p>{ errorMessage }</p>
    }

    async function editEat(event: any) {
        event.preventDefault();
        const edit = event.currentTarget.elements;
        let json = {
            id: data.id,
            name: edit.name.value,
            location: edit.location.value,
            date: edit.date.value,
            price: parseFloat(edit.price.value),
            type: edit.type.value,
            vascoVibes: parseInt(edit.vascovibes.value),
            vascoTaste: parseInt(edit.vascotaste.value),
            vascoAesthetic: parseInt(edit.vascoaesthetic.value),
            laraVibes: parseInt(edit.laravibes.value),
            laraAesthetic: parseInt(edit.laraaesthetic.value),
            laraTaste: parseInt(edit.larataste.value),
            comment: edit.comment.value,
            return: edit.return.checked
        };
        const ret = await editRestaurant(json);
        if (ret.status) toast("Restaurant was successfully edited!");
        else toast.error(ret.message);
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
          <form onSubmit={editEat}>
              <section className='row'>
                  <div className="element">
                      <label htmlFor="name">Name</label>
                      <input type="text" name='name' id='name' placeholder='Restaurant' defaultValue={data.name}/>
                  </div>
                  <div className='element'>
                      <label htmlFor="type">Type</label>
                      <input type="text" name="type" id="type" placeholder='Sushi, mexican, ...'  defaultValue={data.type}/>
                  </div>
              </section>
              <section className='row'>
                  <div className='element'>
                      <label htmlFor="location">Location</label>
                      <input type="text" name="location" id="location" placeholder='City, town, place'  defaultValue={data.location}/>
                  </div>
                  <div className='element'>
                      <label htmlFor="date">Date</label>
                      <input type="date" name="date" id="date"  defaultValue={data.date}/>
                  </div>
              </section>
              <section className='atv'>
                  <div className='col'>
                      <label htmlFor="" className='atv-label'>Vibes</label>
                      <input className="atv-input" type="number" name="vascovibes" id="vascovibes" placeholder="V" min={0} max={10} step={0.5}  defaultValue={data.vascoVibes}/>
                      <input className="atv-input" type="number" name="laravibes" id="laravibes" placeholder="L" min={0} max={10} step={0.5}  defaultValue={data.laraVibes}/>
                  </div>
                  <div className='col'>
                      <label htmlFor="" className='atv-label'>Aesthetic</label>
                      <input className="atv-input" type="number" name="vascoaesthetic" id="vascoaesthetic" placeholder="V" min={0} max={10} step={0.5}  defaultValue={data.vascoAesthetic}/>
                      <input className="atv-input" type="number" name="laraaesthetic" id="laraaesthetic" placeholder="L" min={0} max={10} step={0.5}  defaultValue={data.laraAesthetic}/>
                  </div>
                  <div className='col'>
                      <label htmlFor="" className='atv-label'>Taste</label>
                      <input className="atv-input" type="number" name="vascotaste" id="vascotaste" placeholder="V" min={0} max={10} step={0.5}  defaultValue={data.vascoTaste}/>
                      <input className="atv-input" type="number" name="larataste" id="larataste" placeholder="L" min={0} max={10} step={0.5}  defaultValue={data.laraTaste}/>
                  </div>
              </section>
              <textarea name="comment" id="comment" placeholder='Leave a comment...'  defaultValue={data.comment}></textarea>
              <section className='row'>
                  <div className='element'>
                      <label htmlFor="price">Price</label>
                      <input type="number" name="price" id="price" placeholder='€€' step={0.01} min={0} defaultValue={data.price}/>
                  </div>
                  <div className='ret'>
                      <label htmlFor="checkbox">Would you Return?</label>
                      <input type="checkbox" name="return" id="return" defaultChecked={data.return}/>
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

export default EditEatPage;