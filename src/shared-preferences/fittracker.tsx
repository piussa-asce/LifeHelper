import { EventKeys } from "recharts/types/util/types";
import { get, set, incrementAndSaveNewLastId } from "./shared-preferences";

export interface Weight {
    id: number,
    weight: number,
    date: string
}

export interface Workout {
    id: number,
    date: string,
    padel: number,
    gym: number,
    basketball: number,
    climbing: number,
    other: number
}

export const WEIGHT_KEY = 'weights';
export const WORKOUT_KEY = 'workouts';
export const LAST_WEIGHT_ID = 'last_weight_id';
export const LAST_WORKOUT_ID = 'last_workout_id';

export const addWeight = async (w: Weight)  => {

    if (!w.weight || !w.date) return {status: false, message: "Missing either weight or date."};
    if (new Date(w.date) > new Date()) return {status: false, message: `Cannot add entry in the future: ${w.date}`};
    
    let lid = await get(LAST_WEIGHT_ID);
    let lastId = (lid) ? parseInt(lid) : 1;
    w.id = lastId;
    await incrementAndSaveNewLastId(LAST_WEIGHT_ID, lastId);

    const currentList = await get(WEIGHT_KEY);
    if (currentList == null) {
        set(WEIGHT_KEY, JSON.stringify([w]));
        return {status: true};
    } else {
        let weightList: Weight[] = JSON.parse(currentList);
        if (weightList.filter((d: Weight) => (d.date == w.date)).length > 0) return {status: false, message: `There's already an entry for the date: ${w.date}.`}
        weightList.push(w);
        set(WEIGHT_KEY, JSON.stringify(weightList));
        return {status: true};
    }
}

export const addWorkout = async (wk: Workout) => {
    if (!wk.date) return {status: false, message: "Missing date!"};

    let lid = await get(LAST_WORKOUT_ID);
    let lastId = (lid) ? parseInt(lid) : 1;
    wk.id = lastId;
    await incrementAndSaveNewLastId(LAST_WORKOUT_ID, lastId);

    const list = await get(WORKOUT_KEY);
    if (list == null) {
        set(WORKOUT_KEY, JSON.stringify([wk]));
    } else {
        let workoutList: Workout[] = JSON.parse(list);
        let filterIndex = workoutList.findIndex((item) => item.date == wk.date);
        if (filterIndex == -1) {
            workoutList.push(wk); // add new date)
            set(WORKOUT_KEY, JSON.stringify(workoutList));
        } else {
            workoutList[filterIndex].padel += wk.padel;
            workoutList[filterIndex].gym += wk.gym;
            workoutList[filterIndex].basketball += wk.basketball;
            workoutList[filterIndex].climbing += wk.climbing;
            workoutList[filterIndex].other += wk.other;
            set(WORKOUT_KEY, JSON.stringify(workoutList));
        }
    }
    return {status: true};
}

// export const editWeight = async (w: Weight) => {

//     if (w.id < 1) return {status: false, message: "Id was incorrect."}

//     const parsedList = await getParsedList(WEIGHT_KEY);
//     if (parsedList.length() == 0) return {status: false, message: "Weight list was empty."};

//     const idx = parsedList.findIndex((item: Weight) => item.id == w.id);
//     parsedList[idx] = w;
//     set(WEIGHT_KEY, JSON.stringify(parsedList));
//     return {status: true};
// }

// export const getWeight = async (id: number) => {

//     const parsedList = await getParsedList(WEIGHT_KEY);
//     if (parsedList.length() == 0) return {status: false, message: "Weight list was empty."};
//     return {status: true, data: parsedList.filter((e: Weight) => e.id == id)};
    
// }