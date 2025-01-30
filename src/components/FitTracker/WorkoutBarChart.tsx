import React, { useState, useEffect } from 'react';

import './Chart.css';
import './CustomTooltip.css';

import { TooltipProps, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Bar, Text } from 'recharts';
import { ValueType, NameType} from 'recharts/types/component/DefaultTooltipContent';
import { format } from 'date-fns';
import { Workout } from '../../shared-preferences/fittracker';
import { sortData, displayDate, getInterval, setTfClass } from './utils';

interface ContainerProps { 
  workoutData: Workout[]
}

const WorkoutBarChart: React.FC<ContainerProps> = ({ workoutData }) => {

    /*
        Moves dates displayed to the left or right (if possible)
    */
    const changePage = (left: boolean) => {
        // only working for week rn
        if (left) setPageIndex(pageIndex + 1);
        else setPageIndex(pageIndex - 1);
    }

    const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active) {
            return (
                <div className="custom-tooltip">
                    <p className="row date">{`${label.split("-").reverse().join("-")}`}</p>
                    <p style={{ display: payload?.[0].value == 0 ? 'none' : 'block' }} className="row padel">      {`${payload?.[0].value}`} </p>
                    <p style={{ display: payload?.[1].value == 0 ? 'none' : 'block' }} className="row gym">        {`${payload?.[1].value}`} </p>
                    <p style={{ display: payload?.[2].value == 0 ? 'none' : 'block' }} className="row basketball"> {`${payload?.[2].value}`} </p>
                    <p style={{ display: payload?.[3].value == 0 ? 'none' : 'block' }} className="row climbing">   {`${payload?.[3].value}`} </p>
                    <p style={{ display: payload?.[4].value == 0 ? 'none' : 'block' }} className="row other">      {`${payload?.[4].value}`} </p>
                </div>
            );
        }
        return null;
    };
    
    const CustomTick = (props: any) => {
        const {
            payload: {value}
        } = props;

        const weekdays:string[] = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct","Nov", "Dec"];
        const dateToWeekday = (date: string) => { return weekdays[new Date(date).getDay()]; }
        
        if (timeframe == "1w" || timeframe == "") {
            return <Text {...props}> 
                { dateToWeekday(value) }
            </Text>
        }
        if (timeframe == "1m" || timeframe == "2w")  {
            return <Text {...props}>
                {new Date(value).getDate()} 
            </Text>
        }
        if (timeframe == "1y") {
            return <Text {...props}> 
                {months[new Date(value).getMonth()]} 
            </Text>
        }
    }

    const setRange = (tf: string) => {
        const oneWeek = (document.getElementById("1w") as HTMLLIElement);
        const twoWeeks = (document.getElementById("2w") as HTMLLIElement);
        const oneMonth = (document.getElementById("1m") as HTMLLIElement);
        const oneYear = (document.getElementById("1y") as HTMLLIElement);
        
        setSortedData(sortData("workout", workoutData, tf));
        setTimeframe(tf);

        oneWeek.classList.remove("selected");
        twoWeeks.classList.remove("selected");
        oneMonth.classList.remove("selected");
        oneYear.classList.remove("selected");

        if (tf == "1w") oneWeek.classList.add("selected");
        if (tf == "2w") twoWeeks.classList.add("selected");
        if (tf == "1m") oneMonth.classList.add("selected");
        if (tf == "1y") oneYear.classList.add("selected");
        setPageIndex(0);
    }

    const [sortedData, setSortedData] = useState<any>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [timeframe, setTimeframe] = useState("");

    useEffect(() => {
        if (workoutData.length > 0) setSortedData(sortData("workout", workoutData, timeframe));
    }, [workoutData]);

    if (!sortedData) return ( <span className="loader"></span> );


    const editWorkout = (event: any) => {
        event.preventDefault();
        const data = event.currentTarget.elements;
        let json: Workout = {
            id: 0,
            date: data.date.value,
            padel: data.padel.value,
            gym: data.gym.value,
            basketball: data.basketball.value,
            climbing: data.climbing.value,
            other: data.other.value
        }

    }

    const displayPopup = () => {
        const editPopup = (document.getElementById("edit-workout-popup") as HTMLFormElement);

    }

    return (
        <div className="chart">
            <div className='buttons'>
                <img className="left" src='img/fittracker/playbutton.svg' onClick={() =>changePage(true)} style={{ display: pageIndex == sortedData.length - 1 ? 'none' : 'flex' }}/>
                <div className="dates">{displayDate(sortedData[pageIndex])}</div>
                <img className='right' src='img/fittracker/playbutton.svg' onClick={() => changePage(false)} style={{ display: pageIndex == 0 ? 'none' : 'flex' }}/>
            </div>
            <BarChart width={400} height={250} margin={{top: 0, bottom: 0, right: 50, left: 0 }} data={sortedData[pageIndex]}>
                <CartesianGrid strokeDasharray={"0"} stroke="#333333" vertical={false}/>
                <XAxis 
                    dataKey={"date"}
                    tick={<CustomTick />}
                    interval={getInterval(timeframe)}
                    domain={['auto', 'auto']}
                    />
                <YAxis domain={['0', 'dataMax + 1']}/>
                <Tooltip content={<CustomTooltip />}/>
                {/* <Legend /> */}
                <Bar dataKey="padel" stackId={"a"} fill='#5A89FF' />
                <Bar dataKey="gym" stackId={"a"} fill='#5A89FF' />
                <Bar dataKey="basketball" stackId={"a"} fill='#5A89FF' />
                <Bar dataKey="climbing" stackId={"a"} fill='#5A89FF' />
                <Bar dataKey="other" stackId={"a"} fill='#5A89FF' />
            </BarChart>
            <ul className='data-range'>
                <li id="1w" className={setTfClass(timeframe, "1w")} onClick={() => setRange("1w")}>1w</li>
                <li id="2w" className={setTfClass(timeframe, "2w")} onClick={() => setRange("2w")}>2w</li>
                <li id="1m" className={setTfClass(timeframe, "1m")} onClick={() => setRange("1m")}>1m</li>
            </ul>
            <form onSubmit={editWorkout} style={{display: 'none'}} id='add-wg-popup'>
                <div className='add-popup-title'>Edit Day</div>
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
        </div>
  );
};

export default WorkoutBarChart;