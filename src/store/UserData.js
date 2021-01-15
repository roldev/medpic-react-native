import AsyncStorage from '@react-native-async-storage/async-storage';

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
        return this.getData()[key];
    }

    setData(userData) {
        AsyncStorage.setItem(this.storeUserKey, JSON.stringify(userData));
    }

    setVal(key, val) {
        this.getData().then((data) => {
            data[key] = val;
            this.setData(data);
        });
    }

}