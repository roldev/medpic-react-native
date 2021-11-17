import BackgroundService from 'react-native-background-actions';

import { showNotification } from '../utils/notifications';
import config from '../config';

class ECGResultGetter {
  constructor(ecgName) {
    this.options = {
      taskName: 'GetECGAnalysisResult',
      taskTitle: 'Get ECG Analysis Result',
      taskDesc: 'Get ECG Analysis Result',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: config.colors.primary,
      parameters: {
        ecgName: ecgName,
      },
    };
  }

  async getECGResult(taskDataArguments) {
    const { ecgName } = taskDataArguments;

    fetch(`${config.urls.baseUrl}${config.urls.paths.analyzeFile}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ecgName: ecgName
      })
    })
      .then((res) => {
        const notificationTitle = 'ECG Analysis Result';

        if (!res.ok) {
          console.error({
            status: res.status,
            headers: res.headers,
          });

          const notificationContent = 'There was an error getting analysis';
          showNotification(notificationTitle, notificationContent);

          return;
        }

        res
          .json()
          .then((res) => {
            let notificationContent = 'No result was retrieved';
            
            if(res.data) {
              notificationContent = res.data;
            }

            showNotification(notificationTitle, notificationContent);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        BackgroundService.stop();
      });
  }

  start() {
    BackgroundService.start(this.getECGResult, this.options);
  }

  stop() {
    BackgroundService.stop();
  }
}

export default ECGResultGetter;