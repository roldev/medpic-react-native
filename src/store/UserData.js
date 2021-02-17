import AsyncStorage from "@react-native-async-storage/async-storage";

export const USER_NAME_KEY = "USER_NAME_KEY";
export const USER_PHONE_KEY = "USER_PHONE_KEY";
export const USER_LOCATION_KEY = "USER_LOCATION_KEY";
export const USER_HAS_VISITED_INTRO_KEY = "USER_HAS_VISITED_INTRO_KEY";

export default class UserData {
    constructor() {
        this.storeUserKey = 'user';
    }

    async getData() {
        try {
            const savedUser = await AsyncStorage.getItem(this.storeUserKey);
            if(savedUser !== null) {
                const savedUserData = JSON.parse(savedUser);
                return savedUserData;
            }
        } catch (e) {
            console.error("error loading user");
        }

        return {};
    }

    async getVal(key) {
        const data = await this.getData();
        return data[key];
    }

    async setData(userData) {
        const currentData = await this.getData();
        AsyncStorage.setItem(this.storeUserKey, JSON.stringify({
            ...currentData,
            ...userData
        }));
    }

    setVal(key, val) {
        this.getData().then((data) => {
            data[key] = val;
            this.setData(data);
        });
    }

}