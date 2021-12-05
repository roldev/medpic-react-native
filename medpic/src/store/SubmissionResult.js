import AsyncStorage from '@react-native-async-storage/async-storage';

export const SUBMISSION_RESULT = 'SUBMISSION_RESULT';
export const SUBMISSION_FILE = 'SUBMISSION_FILE';

export default class SubmissionResult {
  constructor() {
    this.storeSubmissionResultKey = 'submissionResult';
  }

  async getData() {
    try {
      const submissionResult = await AsyncStorage.getItem(this.storeSubmissionResultKey);
      
      if (submissionResult !== null) {
        const submissionResultData = JSON.parse(submissionResult);
        return submissionResultData;
      }
    } catch (e) {
      console.error('error retrieving submission result data');
    }

    return {};
  }

  async getVal(key) {
    const data = await this.getData();
    return data[key];
  }

  async setData(submissionData) {
    const currentData = await this.getData();
    return AsyncStorage.setItem(
      this.storeSubmissionResultKey,
      JSON.stringify({
        ...currentData,
        ...submissionData,
      }),
    );
  }

  setVal(key, val) {
    this.getData().then((data) => {
      data[key] = val;
      this.setData(data);
    });
  }

  async clearData() {
    return AsyncStorage.removeItem(this.storeSubmissionResultKey);
  }
}
