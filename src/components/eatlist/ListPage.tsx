import './ListPage.css';
import './Card.css';
import { get, removeRestaurant, remove, RESTAURANTS_KEY, Restaurant } from '../shared-preferences';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from "react-router-dom";

interface ContainerProps { }

const ListPage: React.FC<ContainerProps> = () => {

    let history = useHistory();

    const [cardsData, setCardsData] = useState([]);
    
    useEffect(() => {
        get(RESTAURANTS_KEY)
        .then((data) => {
            if (data != null) {
                setCardsData(JSON.parse(data));
                console.log(data);
            }
        })
    }, []);

    // const cardsData = useRef([
    //     {id: 1, name:"Hereford Beefstouw", ovr: 9.9, location: 'Copenhaga', price: 21.5, date: "14 Nov 2024"},
    //     {id: 2, name:"Aroma Sushi", ovr: 7.6, location: 'Lisboa', price: 20.0, date: "30 Oct 2024"},
    //     {id: 3, name:"Biferia", ovr: 5.2, location: 'Porto', price: 12.5, date: "2 Dec 2023"},
    //     {id: 4, name:"McDonalds", ovr: 2.3, location: 'Lisboa', price: 23.2, date: "7 Jan 2024"},
    // ]);

    const [activeSearch, setActiveSearch] = useState("");
    const [orderBy, setOrderBy] = useState("asc");
    const [orderDp, setOrderDp] = useState("none");

    function updateSearch(search: string) {
        setActiveSearch(search);
    }

    function getColor(ovr: number) {
        if (ovr > 8.5) return "#70ff70";
        if (ovr > 6.5) return '#9bc450';
        if (ovr > 5) return '#d4e448';
        return "#f74b07";
    }

    function toggleOrder() {
        setOrderBy(orderBy == "asc" ? "desc" : "asc")
        setCardsData(cardsData.reverse());
    }

    function toggleOrderDp() {
        setOrderDp(orderDp == 'flex' ? 'none' : 'flex');
        let dp = (document.getElementById('dp-order') as HTMLDivElement);
        if (orderDp == 'none') dp.style.display = 'flex';
        else dp.style.display = 'none'
    }

    function orderField(field: string) {
        let dp = (document.getElementById('dp-order') as HTMLDivElement);
        let orderButton = (document.getElementById('order-button') as HTMLButtonElement);
        setOrderDp('none');
        dp.style.display = 'none';
        if (field == "Rating") setCardsData(cardsData.sort((a: Restaurant, b: Restaurant) => getOverallRating(b) - getOverallRating(a)));
        else if (field == "Price") setCardsData(cardsData.sort((a: Restaurant, b: Restaurant) => b.price - a.price));
        else if (field == "Number") setCardsData(cardsData.sort((a: Restaurant, b: Restaurant) => a.id - b.id));
        orderButton.textContent = field;
    }

    function getOverallRating(card: Restaurant) {
        let value = (card.vascoAesthetic + card.vascoTaste + card.vascoVibes + card.laraAesthetic + card.laraTaste + card.laraVibes) / 6
        let rounded = Math.round(value * 10) / 10
        if (rounded != 10.0 && rounded != 0.0) {
            return parseFloat(rounded.toFixed(1));
        }
        return rounded == 10.0 ? 10 : 0;
    }

    function month(m: number) {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[m - 1];
    }

    function displayDate(date: string) {
        let s = date.split("-");
        return s[2] + " " + month(parseInt(s[1])) + " " + s[0];
    }

    function seeCardDetails(card: Restaurant) {
        history.push({
            pathname: "/eatlist/card/" + card.id,
            state: card
        });
    }

  return (
    <div>
        <div id="filter-container">
            <input name="search-bar" onChange={(e) => updateSearch(e.target.value)} id="search-bar" placeholder="Search..." type="search"/>
            <div className='vline'></div>
            <button id="order-button" className="order-button" onClick={() => toggleOrderDp()}>Order</button>
            <div id="dp-order">
                <div onClick={() => orderField("Number")}>Number</div>
                <div onClick={() => orderField("Price")}>Price</div>
                <div onClick={() => orderField("Rating")}>Rating</div>
            </div>
        </div>
        <div id='cards-list'>
          {cardsData
            .filter((card: Restaurant) => (
                    card.name.toUpperCase().startsWith(activeSearch.toUpperCase()) || 
                    card.location.toUpperCase().startsWith(activeSearch.toUpperCase()) ||
                    displayDate(card.date).toUpperCase().startsWith(activeSearch.toUpperCase()) ||
                    card.type.toUpperCase().startsWith(activeSearch.toUpperCase())
                )) 
           .map((card: Restaurant, index) => (
                <div id={"card-" + card.id} className='card' key={card.id} onClick={() => seeCardDetails(card)}>
                    <div className='title'>
                        <div className="id">#{index + 1}.</div>
                        <div className="name">{card.name}</div>
                    </div>
                    <div className="location">{card.location}</div>
                    <div className="date">{displayDate(card.date)}</div>
                    <div className='type'>{card.type}</div>
                    <div className="price">{card.price}€</div>
                    <div className="ovr" style={{color: getColor(getOverallRating(card))}}>{getOverallRating(card)}</div>
                </div>
          ))}
        </div>
        <div className='add-container'>
            <button id="direction-button" onClick={() => toggleOrder()}>
                <img src="/img/eatlist/order.svg" alt="" sizes='35'/>
            </button>
            <button className='add-button' onClick={() => history.push("/eatlist/add")}>ADD NEW EAT</button>
        </div>
    </div>
  );
};

export default ListPage;