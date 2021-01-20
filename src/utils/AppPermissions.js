import * as Permissions from "expo-permissions";

export default class AppPermissions {
    constructor() {
    }

    async requestPermissionsAsync(type) {
        const { status } = await Permissions.askAsync(type);
        return (status === 'granted');
    }

    async checkPermissionsAsync(type) {
        const { status } = await Permissions.getAsync(type);
        return (status === 'granted');
    }
}

export { Permissions };