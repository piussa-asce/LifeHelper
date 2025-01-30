import { get, set, remove, incrementAndSaveNewLastId } from './shared-preferences';

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

export const addRestaurant = async (setValue: Restaurant) => {
    
    let lid = await get(LAST_RESTAURANT_ID);
    let lastId = (lid) ? parseInt(lid) : 1;

    setValue.id = lastId;
    await incrementAndSaveNewLastId(LAST_RESTAURANT_ID, lastId);
    
    const currentList = await get(RESTAURANTS_KEY);

    if (currentList == null) {
        set(RESTAURANTS_KEY, JSON.stringify([setValue]));
        return {status: true};
    }
    else {
        let restaurantList = JSON.parse(currentList);
        if (!alreadyExists(restaurantList, setValue)) {
            restaurantList.push(setValue);
            set(RESTAURANTS_KEY, JSON.stringify(restaurantList));
            return {status: true};
        }
    }
}

export const removeRestaurant = async (removeId: number) => {
    const currentList = await get(RESTAURANTS_KEY);
    if (currentList != null) {
        const parsedList = JSON.parse(currentList);
        const filteredList = parsedList.filter((item: Restaurant) => !(item.id == removeId));
        set(RESTAURANTS_KEY, JSON.stringify(filteredList));
        return {status: true};
    }
    return {status: false, message: "Restaurant list was empty."}
}

export const editRestaurant = async (r: Restaurant) => {
    const currentList = await get(RESTAURANTS_KEY);
    if (currentList != null) {
        const parsedList = JSON.parse(currentList);
        const idx = parsedList.findIndex((item: Restaurant) => item.id == r.id);
        if (idx != -1) {
            parsedList[idx] = r;
            set(RESTAURANTS_KEY, JSON.stringify(parsedList));
            return {status: true};
        } else return {status: false, message: "No restaurant with that id."};
    }
    return {status: false, message: "Restaurant list was empty."};
}

export const getRestaurant = async (rId: number) => {
    const currentList = await get(RESTAURANTS_KEY);
    if (currentList == null) return {success: false, message: "Restaurant list was empty."};
    const parsedList = JSON.parse(currentList);
    const restaurant = parsedList.filter((card: Restaurant) => (card.id == rId));
    if (restaurant.length == 0) return {sucess: false, message: "No items with that id."}
    return {status: true, data: restaurant[0]};
}

const alreadyExists = (list: any, v: Restaurant) => {
    return list.filter((item: Restaurant) => (item.name == v.name && item.location == v.location && item.type == v.type)).length > 0
}