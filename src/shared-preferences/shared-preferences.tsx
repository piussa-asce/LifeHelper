import { Preferences } from '@capacitor/preferences';

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


// aux

export const incrementAndSaveNewLastId = async (key: string, lastId: number) => {
    let newLastId = lastId + 1;
    await set(key, newLastId.toString());
}