import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Button, Snackbar} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      setVisible(true);
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('AuthStackScreen');
    } catch (error) {
      setError(error.message);
      setVisible(true);
    }
  };

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="メールアドレス"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="パスワード"
        secureTextEntry
        autoCapitalize="none"
      />
      <Button
        mode="contained"
        onPress={handleSignIn}
        style={styles.button}
        disabled={!email || !password}>
        ログイン
      </Button>
      <TouchableOpacity
        onPress={() => navigation.navigate('Auth', {screen: 'Register'})}>
        <Text style={styles.register}>
          アカウントをお持ちでないですか？<Text style={styles.link}>登録</Text>
        </Text>
      </TouchableOpacity>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar} duration={3000}>
        {error}
      </Snackbar>
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

export default LoginScreen;
