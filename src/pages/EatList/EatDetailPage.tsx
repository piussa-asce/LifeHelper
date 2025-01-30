import { IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Footer from '../../components/general/Footer';
import Header from '../../components/general/Header';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { editRestaurant, removeRestaurant, Restaurant } from '../../shared-preferences/eatlist';
import './EatDetailPage.css';
import { format } from 'date-fns';
import { getMainColorOfGraphicItem } from 'recharts/types/util/ChartUtils';

interface stateDetail {
  data: Restaurant,
  index: number
}

const EatDetailPage: React.FC = () => {
  
    const history = useHistory();
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
    
    const deleteRestaurant = () => {
        removeRestaurant(data.id);
        history.push('/eatlist');
    }

    const editRestaurant = () => {
        history.push({
            pathname: `/eatlist/edit/${ data.id }`,
            search: `?data=${JSON.stringify(data)}`
        });
    }

    const getOverallRating = (card: Restaurant) => {
        let value = (card.vascoAesthetic + card.vascoTaste + card.vascoVibes + card.laraAesthetic + card.laraTaste + card.laraVibes) / 6
        let rounded = Math.round(value * 10) / 10
        return (rounded != 10.0 && rounded != 0.0) ? parseFloat(rounded.toFixed(1)) : (rounded == 10.0 ? 10 : 0);
    }

    function getColor(ovr: number) {
        if (ovr > 8.5) return "#70ff70";
        if (ovr > 6.5) return '#9bc450';
        if (ovr > 5) return '#d4e448';
        return "#f74b07";
    }

    const ovr = getOverallRating(data);

    return (
        <IonPage>
            <IonHeader>
                <Header/>
            </IonHeader>
        
            <IonContent fullscreen>
                <div className="detail-container">
                    <p className="name"> { data.name } </p>
                    <div className='deets'>
                        <p className="deet"><img src="/img/general/location.svg" alt="" width={20} height={20} /> { data.location } </p>
                        <p className="deet"><img src="/img/general/calendar.svg" alt="" width={20} height={20} /> { format(data.date, "dd MMM yyyy")} </p>
                        <p className="deet"><img src="/img/eatlist/food.svg" alt="" width={20} height={20} /> { data.type } </p>
                    </div>
                    <p className="comment">"{ data.comment }"</p>
                    <div className='rating'>
                        <p className='person'>Lara</p>
                        <div className="ratings">
                            <div> <p className="tag">Vibes</p> <p className='value'>{ data.laraVibes}</p> </div>
                            <div> <p className="tag">Aesthetics</p> <p className='value'>{ data.laraAesthetic}</p> </div>
                            <div> <p className="tag">Taste</p> <p className='value'>{ data.laraTaste}</p> </div>
                        </div>
                    </div>
                    <div className='rating'>
                        <p className='person'>Vasco</p>
                        <div className="ratings">
                            <div> <p className="tag">Vibes</p> <p className='value'>{ data.vascoVibes}</p> </div>
                            <div> <p className="tag">Aesthetics</p> <p className='value'>{ data.vascoAesthetic}</p> </div>
                            <div> <p className="tag">Taste</p> <p className='value'>{ data.vascoTaste}</p> </div>
                        </div>
                    </div>
                    <div className='final'>
                        <div><p>Price</p> <p>{data.price} €</p></div>
                        <div><p>Overall Rating</p> <p style={{color: getColor(ovr)}}>{ovr}</p></div>
                        <div><p>Return</p> <p>{ data.return ? "YES" : "NO"}</p></div>
                    </div>
                </div>
                <div className='button-container'>
                    <button className="delete" onClick={deleteRestaurant}>DELETE</button>
                    <button className="edit" onClick={editRestaurant}>EDIT</button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default EatDetailPage;