import * as Notifications from 'expo-notifications';

export function showNotification(title, content) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: content,
    },
    trigger: null,
  });
}