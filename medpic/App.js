import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';

import Login from './src/screens/Login';
import Explanation from './src/screens/Explanation';
import ECGCapture from './src/screens/ECGCapture';
import SelectAction from './src/screens/SelectAction';
import Preview from './src/screens/Preview';

const Stack = createStackNavigator();

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Explanation"
          component={Explanation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ECGCapture"
          component={ECGCapture}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SelectAction"
          component={SelectAction}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Preview"
          component={Preview}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
