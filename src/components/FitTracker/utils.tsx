import { format } from 'date-fns';

export const getWeekStart = (date: Date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
};

export const getWeekDates = (startDate: Date) => {
    const thisWeeksDates = [format(startDate, "yyyy-MM-dd")];
    let lastDay = startDate;
    for (let i = 1; i < 7; i++) {
        lastDay = new Date(lastDay.getTime() + (1000 * 60 * 60 * 24));
        thisWeeksDates.push(format(lastDay, "yyyy-MM-dd"));
    }
    return thisWeeksDates;
}

/*
    Displays the date interval shown in the chart
*/
export const displayDate = (rangeData: any[]) => {
    try {
        if (!rangeData) return ""; 
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct","Nov", "Dec"];
        let s0 = rangeData[0].date.split("-");
        let s6 = rangeData[rangeData.length - 1].date.split("-");
        return `${s0[2]} ${months[parseInt(s0[1]) - 1]} ${s0[0]} - ${s6[2]} ${months[parseInt(s6[1]) - 1]} ${s6[0]}`;
    } catch (error) {
        console.error("displayDate @ utils.tsx: " + error)
    }
}

export const sortData = (datatype: string, data: any[], tf: string) => {
    switch(tf) {
        case "1w":
            return sortDataByWeek(datatype, data, 1);
        case "2w":
            return sortDataByWeek(datatype, data, 2);
        case "1m":
            return sortDataByMonth(datatype, data, 1);
        case "1y": 
            return sortDataByYear(datatype, data, 1);
        case "":
            return sortDataByWeek(datatype, data, 1);
    }
}

export const getInterval = (tf: string) => {
    if (tf == "2w") return 1;
    if (tf == "1m") return 5;
    if (tf == "1y") return 60;
    return 0;
}

export const setTfClass = (timeframe: string, tf: string) => {
    if (timeframe == "" && tf == "1w") return "selected";
    return (timeframe == tf) ? "selected" : "";
}

/* for utils only */

const getEmptyWeight = () => {
    return {id: 0, date: "", weight: null};
}

const getEmptyWorkout = () => {
    return {id: 0, date: "", padel: 0, gym: 0, basketball: 0, climbing: 0, other: 0};
}

const sortDataByWeek = (datatype: string, data: any[], weeks: number) => {
    let weekCounter = weeks;
    let checkDate = getWeekStart(new Date(data[0].date));
    const nextSunday = new Date(); // first day of next week
    nextSunday.setDate(nextSunday.getDate() + (7 - new Date().getDay()));
    nextSunday.setHours(0,0,0,0);

    const returnData: any[] = [];
    let weekData = [];
    while (checkDate.getTime() != nextSunday.getTime()) {
        // if data exists, add to return data for that week 
        // and remove the first item from copyData
        const stringDate = format(checkDate, "yyyy-MM-dd");
        const index = data.findIndex(obj => obj.date == stringDate);
        if (index != -1) { // checks first date since it is sorted
            weekData.push(data[index]);
        } else {
            const emptyRow = datatype == "weight" ? getEmptyWeight() : getEmptyWorkout();
            emptyRow.date = stringDate;
            weekData.push(emptyRow);
        }
        checkDate = addDay(checkDate);
        if (checkDate.getDay() == 0) {
            weekCounter -= 1;
            if (weekCounter == 0) {
                weekCounter = weeks;
                returnData.push(weekData);
                weekData = [];
            }
        }
    }
    return returnData.reverse();
}

const sortDataByMonth = (datatype: string, data: any[], months: number) => {
    let monthCounter = months;
    let firstDate = new Date(data[0].date);
    let checkDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    let date = new Date();
    let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const returnData = [];
    let monthData: any[] = [];
    while (checkDate.getTime() != nextMonth.getTime()) {
        const stringDate = format(checkDate, "yyyy-MM-dd");
        const index = data.findIndex(obj => obj.date == stringDate);
        if (index != -1) monthData.push(data[index]);
        else {
            const emptyRow = datatype == "weight" ? getEmptyWeight() : getEmptyWorkout();
            emptyRow.date = stringDate;
            monthData.push(emptyRow);
        }
        checkDate = addDay(checkDate);
        if (checkDate.getDate() == 1) {
            monthCounter -= 1
            if (monthCounter == 0) {
                monthCounter = months;
                let lastElement = monthData.pop();
                returnData.push(monthData);
                monthData = [lastElement];
            }
        }
    }
    return returnData.reverse();
}

const sortDataByYear = (datatype: string,data: any[], years: number) => {
    let yearCounter = years;
    let firstDate = new Date(data[0].date);
    let checkDate = new Date(firstDate.getFullYear(), 0, 1);
    const date = new Date();
    let nextYear = new Date(date.getFullYear() + 1, 0, 1);

    const returnData = [];
    let yearData: any[] = [];
    if (datatype == "workout") {
        const empty = getEmptyWorkout()
        empty.date = format(checkDate, "yyyy-MM-dd");
        returnData.push(empty);
    }
    while (checkDate.getTime() != nextYear.getTime()) {
        const stringDate = format(checkDate, "yyyy-MM-dd");
        const index = data.findIndex(obj => obj.date == stringDate);
        if (index != -1) yearData.push(data[index]);
        else {
            const emptyRow = datatype == "weight" ? getEmptyWeight() : getEmptyWorkout();
            emptyRow.date = stringDate;
            yearData.push(emptyRow);
        }
        checkDate = addDay(checkDate);
        if (checkDate.getMonth() == 0 && checkDate.getDate() == 1) {
            yearCounter -= 1
            if (yearCounter == 0) {
                yearCounter = years;
                let lastElement = yearData.pop();
                returnData.push(yearData);
                yearData = [lastElement];
            }
        }
    }
    return returnData.reverse();
}

const addDay = (date: Date) => {
    return new Date(date.getTime() + (1000 * 60 * 60 * 24))
}
