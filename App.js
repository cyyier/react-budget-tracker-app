import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TransactionScreen from './src/screens/TransactionScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, View} from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(newUser => {
      setUser(newUser);
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber; // 清理订阅
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // 用户已登录时显示主页面
          <Stack.Screen
            name="Home"
            component={TransactionScreen}
            options={{title: 'つける'}}
          />
        ) : (
          // 用户未登录时显示登录页面
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Kakeibo'}}
          />
        )}
        {/* 注册页面总是可访问 */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{title: 'Kakeibo'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
