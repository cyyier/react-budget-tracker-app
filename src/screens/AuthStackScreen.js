import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import UserInfoScreen from './UserInfoScreen';
import auth from '@react-native-firebase/auth';

const AuthStack = createStackNavigator();

const AuthStackScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setCurrentUser);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      {currentUser ? (
        <AuthStack.Screen name="UserInfo" component={UserInfoScreen} />
      ) : (
        <AuthStack.Screen name="Login" component={LoginScreen} />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthStackScreen;
