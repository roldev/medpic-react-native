import * as Permissions from "expo-permissions";

export default class AppPermissions {
    constructor() {
    }

    async requestPermissionAsync(type) {
        const { status } = await Permissions.askAsync(type);
        return (status === 'granted');
    }

    async getLocationPermission() {
        const isGranted = await this.requestPermissionAsync(
            Permissions.LOCATION
        );

        return isGranted;
    }

    async getCameraPermission() {
        const isGranted = await this.requestPermissionAsync(
            Permissions.CAMERA
        );

        return isGranted;
    }

    async getAudioRecordingPermission() {
        const isGranted = await this.requestPermissionAsync(
            Permissions.AUDIO_RECORDING
        );

        return isGranted;
    };

}

export { Permissions };