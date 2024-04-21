import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const UserInfoScreen = ({navigation}) => {
  const user = auth().currentUser;

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>おかえりなさい</Text>
      <Text>Email: {user.email}</Text>
      <Button mode="text" onPress={handleLogout} style={styles.button}>
        ログアウト
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
  },
});

export default UserInfoScreen;
