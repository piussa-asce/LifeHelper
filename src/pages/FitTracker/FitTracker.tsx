import './FitTracker.css';

import { IonContent, IonHeader, IonPage } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import WorkoutBarChart from '../../components/FitTracker/WorkoutBarChart';
import WeightAreaChart from '../../components/FitTracker/WeightAreaChart';

import { toast } from 'react-toastify';

import { Weight, addWeight, WEIGHT_KEY, Workout, WORKOUT_KEY, addWorkout } from '../../shared-preferences/fittracker';
import { get } from '../../shared-preferences/shared-preferences';

const FitTracker: React.FC = () => {

    async function addNewWeight(event: any) {
        event.preventDefault();
        const data = event.currentTarget.elements;
        let json: Weight = {
            id: 0,
            weight: parseFloat(data.weight.value),
            date: data.date.value
        };
        const ret = await addWeight(json);
        if (ret.status) toast("Weight added successfully!");
        else toast.error(ret.message);
        location.reload();
    }

    async function addNewWorkout(event: any) {
        event.preventDefault();
        const data = event.currentTarget.elements;
        let json: Workout = {
            id: 0,
            date: data.date.value,
            padel: data.workoutType.value == "padel" ? 1 : 0,
            gym: data.workoutType.value == "gym" ? 1 : 0,
            basketball: data.workoutType.value == "basketball" ? 1 : 0,
            climbing: data.workoutType.value == "climbing" ? 1 : 0,
            other: data.workoutType.value == "other" ? 1 : 0    
        }
        const ret = await addWorkout(json);
        if (ret.status) toast("Workout added successfully!");
        else toast.error(ret.message);
        location.reload();
    }

    const [weightData, setWeightData] = useState<Weight[]>([]);
    const [workoutData, setWorkoutData] = useState<Workout[]>([]);
    const pageSel = localStorage.getItem("pageSelected");
    const [pageSelected, setPageSelected] = pageSel != null ? useState(pageSel) : useState('weight');

    useEffect(() => {
        const fetchData = async () => {
            const wgData = await get(WEIGHT_KEY);
            if (wgData != null) {
                let sortedWgData = JSON.parse(wgData).sort((a: Weight, b: Weight) => new Date(a.date)[Symbol.toPrimitive]('number') - new Date(b.date)[Symbol.toPrimitive]('number') );
                setWeightData(sortedWgData);
            }
            const wkData = await get(WORKOUT_KEY);
            if (wkData != null) {
                let sortedWkData = JSON.parse(wkData).sort((a: Workout, b: Workout) => new Date(a.date)[Symbol.toPrimitive]('number') - new Date(b.date)[Symbol.toPrimitive]('number') );
                setWorkoutData(sortedWkData);
            }
        }
        fetchData()
            .catch(console.error);
    }, []);

    const actionButton = () => {
        const wgPopup = (document.getElementById("add-wg-popup") as HTMLButtonElement);
        const wkPopup = (document.getElementById("add-wk-popup") as HTMLButtonElement);
        if (pageSelected == "weight") wgPopup.style.display = wgPopup.style.display == 'none' ? 'flex' : 'none';
        if (pageSelected == "workout") wkPopup.style.display = wkPopup.style.display == 'none' ? 'flex' : 'none';
    }

    function inSameWeek(date1: string, date2: Date) {
        const d1 = new Date(date1);

        const getWeekStart = (date: Date) => {
            const dayOfWeek = date.getDay();
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - dayOfWeek);
            startOfWeek.setHours(0, 0, 0, 0);
            return startOfWeek;
        };
        const weekStart1 = getWeekStart(d1);
        const weekStart2 = getWeekStart(date2);
        return weekStart1.getDate() == weekStart2.getDate() && weekStart1.getMonth() == weekStart2.getMonth() && weekStart2.getFullYear() == weekStart2.getFullYear();
    }

    function inSameMonth(date1: string, date2: Date) {
        const d1 = new Date(date1);
        return d1.getFullYear() == date2.getFullYear() && d1.getMonth() == date2.getMonth();
    }

    function avgWeight(d: string, day: Date) {
        if (d == "week") {
            const thisWeek: Weight[] = weightData.filter((d: Weight) => inSameWeek(d.date, day));
            if (thisWeek.length == 0) return 0;
            const reduced = thisWeek.reduce((sum, w) => sum + (w.weight || 0), 0);
            if (reduced == 0) return weightData[weightData.length - 1].weight
            return reduced / thisWeek.length;
        }
        else if (d == "month") {
            const thisMonth: Weight[] = weightData.filter((d: Weight) => inSameMonth(d.date, day));
            if (thisMonth.length == 0) return 0;
            return thisMonth.reduce((sum, w) => sum + (w.weight || 0), 0) / thisMonth.length;
        }
        else if (d == "year") {
            const thisYear: Weight[] = weightData.filter((d:Weight) => day.getFullYear() == new Date(d.date).getFullYear());
            if (thisYear.length == 0) return 0;
            return thisYear.reduce((sum, w) => sum + (w.weight || 0), 0) / thisYear.length;
        }
        return 0;
    }
    
    function avgArrow(diff: number, arrow: HTMLImageElement) {
        if (arrow != null) {
            arrow.classList.remove("up");
            arrow.classList.remove("down");
            if (diff > 0) arrow.classList.add("up");
            else if (diff < 0) arrow.classList.add("down");
        }
    }

    function togglePage(page: string) {
        const weight = (document.getElementById('weight-selector') as HTMLSpanElement);
        const workout = (document.getElementById('workout-selector') as HTMLSpanElement);
        const area = (document.getElementById('area') as HTMLDivElement);
        const bar = (document.getElementById('bar') as HTMLDivElement);
        const wgPopup = (document.getElementById("add-wg-popup") as HTMLButtonElement);
        const wkPopup = (document.getElementById("add-wk-popup") as HTMLButtonElement);
        weight.classList.remove('on');
        workout.classList.remove('on');
        setPageSelected(page);
        wgPopup.style.display = 'none';
        wkPopup.style.display = 'none';
        localStorage.setItem("pageSelected", page);
        if (page == "weight") {
            bar.style.display = 'none';
            area.style.display = 'flex';
            weight.classList.add('on');
        }
        else if (page == "workout") {
            bar.style.display = 'flex';
            area.style.display = 'none';
            workout.classList.add('on');
        }
    }

    function weightDiff(timeframe: string) {
        if (weightData.length == 0) return 0;
        
        const today = new Date();
        let timeBefore: Date;
        if (timeframe == "week") timeBefore = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (timeframe == "month") timeBefore = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        else if (timeframe == "year") timeBefore = new Date(today.getFullYear() - 365 * 24 * 60 * 60 * 1000);
        else return 0;

        const weightBefore = avgWeight(timeframe, timeBefore);
        const currentWeight = weightData[weightData.length - 1].weight; // get last weight
        if (weightBefore == 0 || currentWeight == 0) return 0;
        return currentWeight - weightBefore;
    }

    function lastWeights(timeframe: string) {
        const diff = weightDiff(timeframe);
        const arrow = (document.getElementById(timeframe+"-arrow") as HTMLImageElement);
        avgArrow(diff, arrow);
        return weightDiff(timeframe) != 0 ? (Math.round(Math.abs(diff) * 10) / 10).toString() : "="
    }

    function countWorkouts(timeframe: string) {
        const currentDay = new Date();
        if (timeframe == "week") {
            return workoutData
                    .filter((item) => inSameWeek(item.date, currentDay))
                    .reduce((sum, cv) => sum + cv.padel + cv.gym + cv.basketball + cv.climbing + cv.other, 0);
        }
        if (timeframe == "month") {
            return workoutData
                    .filter((item) => inSameMonth(item.date, currentDay))
                    .reduce((sum, cv) => sum + cv.padel + cv.gym + cv.basketball + cv.climbing + cv.other, 0);
        }
        if (timeframe == "year") {
            return workoutData
                    .filter((item) => item.date.split("-")[0] == currentDay.getFullYear().toString())
                    .reduce((sum, cv) => sum + cv.padel + cv.gym + cv.basketball + cv.climbing + cv.other, 0);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <div id="header-green"><span id="app-name-green">FIT TRACKER</span></div>   
            </IonHeader>

            <IonContent fullscreen>
                <div>
                    <div className='select'>
                        <span id="weight-selector" className={localStorage.getItem('pageSelected') == "weight" ? 'on' : ''} onClick={()=> togglePage("weight")}>Weight Tracker</span>
                        <span id="workout-selector" className={localStorage.getItem('pageSelected') == "workout" ? 'on' : ''} onClick={()=> togglePage("workout")}>Workout Tracker</span>
                    </div>
                    <div id="area" style={{ display: localStorage.getItem('pageSelected') == 'weight' ? 'flex' : 'none'}} className='chart-container'>
                        {/* <div className='title'>WEIGHT PROGRESSION</div> */}
                        <WeightAreaChart weightData={weightData}/>
                        <ul className='stats'>
                            <li> 
                                <span className="li-title">This Week</span>  
                                <img id="week-arrow" src="/img/fittracker/triangle.svg" className="img" alt="" />
                                <span className='diff'>{lastWeights('week')}</span>
                                <span className='avg'>{Math.round(avgWeight('week', new Date()) * 10) / 10} Kg</span>   
                            </li>
                            <li> 
                                <span className="li-title">This Month</span>  
                                <img id="month-arrow" src="/img/fittracker/triangle.svg" className="img" alt="" />
                                <span className='diff'>{lastWeights('month')}</span>
                                <span className='avg'>{Math.round(avgWeight('month', new Date()) * 10) / 10} Kg</span>    
                            </li>
                            <li> 
                                <span className="li-title">This Year</span>  
                                <img id="year-arrow" src="/img/fittracker/triangle.svg" className="img" alt="" />
                                <span className='diff'>{lastWeights('year')}</span>
                                <span className='avg'>{Math.round(avgWeight('year', new Date()) * 10) / 10} Kg</span>
                            </li>
                        </ul>  
                    </div>

                    <div id="bar" style={{display: localStorage.getItem('pageSelected') == 'workout' ? 'flex' : 'none'}} className='chart-container'>
                        {/* <div className='title'>WORKOUTS</div> */}
                        <WorkoutBarChart workoutData={workoutData}/>
                        <ul className='stats'>
                            <li> 
                                <span className="li-title">This Week</span>  
                                <img id="week-arrow" src="/img/fittracker/triangle.svg" className="img" alt="" />
                                <span className='count'>{countWorkouts('week')}x</span>   
                            </li>
                            <li> 
                                <span className="li-title">This Month</span>  
                                <img id="month-arrow" src="/img/fittracker/triangle.svg" className="img" alt="" />
                                <span className='count'>{countWorkouts('month')}x</span>   
                            </li>
                            <li> 
                                <span className="li-title">This Year</span>
                                <img id="year-arrow" src="/img/fittracker/triangle.svg" className="img" alt="" />
                                <span className='count'>{countWorkouts('year')}x</span>   
                            </li>
                        </ul>
                    </div>

                    

                    <button id='action-button' onClick={actionButton}>
                        <img src="/img/general/plus.svg" width={50} height={50} alt="" />
                    </button>
                    <form onSubmit={addNewWeight} style={{display: 'none'}} id='add-wg-popup'>
                        <div className='add-popup-title'>Add New Entry</div>
                        <label htmlFor="weight">
                            Weight:
                            <input type="number" name='weight' id="weight" step={0.1}/>
                            Kg
                        </label>
                        <label htmlFor="date">
                            Date:
                            <input type="date" name='date' id="date"/>
                        </label>
                        <input type="submit" name='submit' id="submit" value={"SAVE"} />
                    </form>
                    <form onSubmit={addNewWorkout} style={{display: 'none'}} id='add-wk-popup'>
                        <div className='add-popup-title'>Add New Entry</div>

                        <label htmlFor="workout">
                            Workout:
                            <select name="workoutType" id="workoutType">
                                <option value="padel">Padel</option>
                                <option value="gym">Gym</option>
                                <option value="basketball">Basketball</option>
                                <option value="climbing">Climbing</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                        <label htmlFor="date">
                            Date:
                            <input type="date" name='date' id="date"/>
                        </label>
                        <input type="submit" name='submit' id="submit" value={"SAVE"} />
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default FitTracker;