import React, { useEffect, useState } from 'react';

import './Chart.css';
import './CustomTooltip.css';

import { TooltipProps, Text, Area, AreaChart, BarChart, CartesianAxis, CartesianGrid, Tooltip, XAxis, YAxis, Bar, Legend } from 'recharts';
import { ValueType, NameType} from 'recharts/types/component/DefaultTooltipContent';
import { Weight } from '../../shared-preferences/fittracker';
import { sortData, displayDate, getInterval, setTfClass } from './utils';

interface ContainerProps {
    weightData: Weight[]
}

const WeightAreaChart: React.FC<ContainerProps> = ({ weightData }) => {

    const color = "#94DEA5";

    const reverseDate = (date: string) => {
        return date.split("-").reverse().join("-");
    }

    const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active && (payload != undefined && payload.length > 0)) {
            return (
                <div className="custom-tooltip">
                    <p className="row date">{`${reverseDate(label)}`}</p>
                    <p className="row weight">{`${payload?.[0].value != null ? payload?.[0].value : 0} Kg`}</p>
                </div>
            );
        }
        return null;
    };

    const getStrokeWidth = () => { return timeframe != "1y" ? 2 : 0.5 }
    const getRadius = () => { return timeframe != "1y" ? 2 : 1 }
    
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
        
        setSortedData(sortData("weight", weightData, tf));
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

    /*
        Moves dates displayed to the left or right (if possible)
    */
    const changePage = (left: boolean) => {
        // only working for week rn
        if (left) setPageIndex(pageIndex + 1);
        else setPageIndex(pageIndex - 1);
    }

    const [sortedData, setSortedData] = useState<any>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [timeframe, setTimeframe] = useState("");

    useEffect(() => {
        if (weightData.length > 0) setSortedData(sortData("weight", weightData, timeframe));
    }, [weightData]);

    if (!sortedData) return ( <p>Loading data ...</p> );

    return (
        <div className="chart">
            <div className='buttons'>
                <img className="left" src='img/fittracker/playbutton.svg' onClick={() =>changePage(true)} style={{ display: pageIndex == sortedData.length - 1 ? 'none' : 'flex' }}/>
                <div className="dates">{displayDate(sortedData[pageIndex])}</div>
                <img className='right' src='img/fittracker/playbutton.svg' onClick={() => changePage(false)} style={{ display: pageIndex == 0 ? 'none' : 'flex' }}/>
            </div>
            <AreaChart width={400} height={250} margin={{top: 0, bottom: 0, right: 50, left: 20}} data={sortedData[pageIndex]}>
                <defs>
                    <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={"#94DEA5"} stopOpacity={0.4}></stop>
                        <stop offset="75%" stopColor={"#94DEA5"} stopOpacity={0.05}></stop>
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey={"date"}
                    tick={<CustomTick />}
                    interval={getInterval(timeframe)}
                    domain={['auto', 'auto']}
                />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']}/>
                <CartesianGrid vertical={false} strokeDasharray={"0"} stroke='#444444'/>
                <Tooltip content={<CustomTooltip />}/>
                <Area connectNulls={true} type="monotone" dataKey={"weight"} stroke='#94DEA5' fillOpacity={0.5} fill={`url(#color${color})`} 
                    dot={{ stroke: '#94DEA5', strokeWidth: getStrokeWidth(), r: getRadius(), strokeDasharray: ''}} />
            </AreaChart>
            <ul className='data-range'>
                <li id="1w" className={setTfClass(timeframe, "1w")} onClick={() => setRange("1w")}>1w</li>
                <li id="2w" className={setTfClass(timeframe, "2w")} onClick={() => setRange("2w")}>2w</li>
                <li id="1m" className={setTfClass(timeframe, "1m")} onClick={() => setRange("1m")}>1m</li>
                <li id="1y" className={setTfClass(timeframe, "1y")} onClick={() => setRange("1y")}>1y</li>
            </ul>
        </div>
    );
};

export default WeightAreaChart;