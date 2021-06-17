import { Notifications } from 'react-native-notifications';

export function showNotification(title, content) {
  Notifications.postLocalNotification({
    title: title,
    body: content,
  });
}