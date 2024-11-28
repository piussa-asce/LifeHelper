import { Preferences } from '@capacitor/preferences';
import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js';

export interface Restaurant {
    id: number;
    name: string;
    location: string;
    date: string;
    price: number;
    type: string;
    vascoAesthetic: number;
    vascoTaste: number;
    vascoVibes: number;
    laraAesthetic: number;
    laraTaste: number;
    laraVibes: number;
    comment: string;
    return: boolean;
}

export const RESTAURANTS_KEY = 'restaurants';
export const LAST_RESTAURANT_ID = 'last_restaurant_id';

export const get = async (getKey: string) => {
    const { value } = await Preferences.get({ key: getKey });
    return value;
}

export const set = async (setKey: string, setValue: string) => {
    await Preferences.set({
        key: setKey,
        value: setValue,
    });
}

export const remove = async (removeKey: string) => {
    await Preferences.remove({ key: removeKey });
}

export const addRestaurant = async (setValue: Restaurant) => {
    
    let lid = await get(LAST_RESTAURANT_ID);
    let lastId = 1;
    if (lid != null) {
        lastId = parseInt(lid);
    }
    setValue.id = lastId;
    incrementAndSaveNewLastId(LAST_RESTAURANT_ID, lastId);
    const currentList = await get(RESTAURANTS_KEY);

    if (currentList == null) {
        set(RESTAURANTS_KEY, JSON.stringify([setValue]));
        return {success: true};
    }
    else {
        let restaurantList = JSON.parse(currentList);
        if (!alreadyExists(restaurantList, setValue)) {
            restaurantList.push(setValue);
            set(RESTAURANTS_KEY, JSON.stringify(restaurantList));
            return {success: true};
        }
    }
}

export const removeRestaurant = async (removeId: number) => {
    const currentList = await get(RESTAURANTS_KEY);
    if (currentList != null) {
        const parsedList = JSON.parse(currentList);
        const filteredList = parsedList.filter((item: Restaurant) => !(item.id == removeId));
        set(RESTAURANTS_KEY, JSON.stringify(filteredList));
        return {success: true};
    }
    return {success: false, message: "Restaurant list was empty."}
}

export const editRestaurant = async (editId: number, editObject: object) => { // edit object must be { string: string, ...}
    const currentList = await get(RESTAURANTS_KEY);
    if (currentList != null) {
        const parsedList = JSON.parse(currentList);
        const idx = parsedList.findIndex((item: Restaurant) => item.id == editId);
        for (const[key, value] of Object.entries(editObject)) {
            parsedList[idx][key] = value;
        }
        set(RESTAURANTS_KEY, JSON.stringify(parsedList));
        return {sucess: true};
    }
    return {success: false, message: "Restaurant list was empty."};
}

export const getRestaurant = async (rId: number) => {
    const currentList = await get(RESTAURANTS_KEY);
    if (currentList == null) return {success: false, message: "Restaurant list was empty."};
    const parsedList = JSON.parse(currentList);
    const restaurant = parsedList.filter((card: Restaurant) => (card.id == rId));
    if (restaurant.length == 0) return {sucess: false, message: "No items with that id."}
    if (restaurant.length > 1) return {success: false, message: "More than one item was detected with that id."}
    return {success: true, data: restaurant[0]};
}

const alreadyExists = (list: any, v: Restaurant) => {
    return list.filter((item: Restaurant) => (item.name == v.name && item.location == v.location && item.type == v.type)).length > 0
}

const incrementAndSaveNewLastId = (key: string, lastId: number) => {
    let newLastId = lastId + 1;
    set(key, newLastId.toString());
}