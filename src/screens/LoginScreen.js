import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="メールアドレス"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="パスワード"
        secureTextEntry
      />
      <Button mode="contained" onPress={handleSignIn} style={styles.button}>
        ログイン
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.register}>
          アカウントをお持ちでないですか？<Text style={styles.link}>登録</Text>
        </Text>
      </TouchableOpacity>
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
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    marginBottom: 10,
  },
  register: {
    marginTop: 15,
    fontSize: 16,
  },
  link: {
    color: 'blue',
  },
});

export default SignInScreen;
