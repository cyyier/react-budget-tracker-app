import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('エラー', '全ての項目を入力してください。');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('エラー', 'パスワードが一致しません。');
      return;
    }
    setLoading(true);
    try {
      const newUser = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await newUser.user.sendEmailVerification(); // 发送验证邮件
      Alert.alert(
        '登録成功',
        '確認メールを送信しました。メールを確認してください。',
        [{text: 'OK', onPress: () => navigation.navigate('Login')}],
      );
    } catch (error) {
      console.error(error);
      Alert.alert('登録エラー', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>新規登録</Text>
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
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="パスワードを再入力"
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        disabled={loading}>
        登録
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
  },
});

export default RegisterScreen;
