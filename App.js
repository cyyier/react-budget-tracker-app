/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Image} from 'react-native';
import {useTheme} from 'react-native-paper';

import TransactionScreen from './src/screens/TransactionScreen';
import TransactionListScreen from './src/screens/TransactionsListScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UserInfoScreen from './src/screens/UserInfoScreen';
import AuthStackScreen from './src/screens/AuthStackScreen';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import DashboardScreen from './src/screens/DashboardScreen';

const Tab = createMaterialBottomTabNavigator();
const AuthStack = createStackNavigator();

function AuthStackScreens() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="AuthStackScreen" component={AuthStackScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="UserInfoScreen" component={UserInfoScreen} />
    </AuthStack.Navigator>
  );
}

function MyTabs() {
  const {currentUser} = useAuth();
  const theme = useTheme();
  theme.colors.secondaryContainer = 'transperent';
  return (
    <Tab.Navigator
      initialRouteName={currentUser ? 'Transaction' : 'Login'}
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      shifting={true}
      barStyle={{backgroundColor: '#694fad'}}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconName;
          if (route.name === 'Transaction') {
            iconName = focused
              ? require('./android/app/src/main/assets/images/pen_active.png')
              : require('./android/app/src/main/assets/images/pen_unactive.png'); // 非选中的图片
          } else if (route.name === 'TransactionList') {
            iconName = focused
              ? require('./android/app/src/main/assets/images/note_active.png')
              : require('./android/app/src/main/assets/images/note_unactive.png');
          } else if (route.name === 'Auth') {
            iconName = focused
              ? require('./android/app/src/main/assets/images/user_active.png')
              : require('./android/app/src/main/assets/images/user_unactive.png');
          }
          else if (route.name === 'Dashboard') {
            iconName = focused
              ? require('./android/app/src/main/assets/images/dashboard_active.png')
              : require('./android/app/src/main/assets/images/dashboard_unactive.png');
          }

          return <Image source={iconName} style={{width: 28, height: 28}} />;
        },
      })}>
      {currentUser ? (
        <>
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              tabBarLabel: 'れぽ',
            }}
          />
          <Tab.Screen
            name="Transaction"
            component={TransactionScreen}
            options={{
              tabBarLabel: 'つける',
            }}
          />
          <Tab.Screen
            name="TransactionList"
            component={TransactionListScreen}
            options={{
              tabBarLabel: 'みる',
            }}
          />
          <Tab.Screen
            name="Auth"
            component={AuthStackScreens}
            options={{tabBarLabel: 'わたし'}}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Auth"
            component={LoginScreen}
            options={{tabBarLabel: 'Welcome'}}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </AuthProvider>
  );
}
