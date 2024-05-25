import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {database} from '../config/firebaseConfig';
import {categories, transactionTypes} from '../config/constants';
import {ref, push, onValue, off} from 'firebase/database';
import {TextInput, Button, Text, Snackbar, Switch} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAuth} from '../contexts/AuthContext';

const TransactionScreen = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(categories[0].id);
  const [type, setType] = useState(transactionTypes[0].id);
  const [date, setDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const {currentUser} = useAuth();

  useEffect(() => {
    const transRef = ref(database, '/transactions');
    const handleData = snap => {
      if (snap.val()) {
        setTransactions(Object.values(snap.val()));
      }
    };
    onValue(transRef, handleData, error => alert(error));
    return () => {
      off(transRef, 'value', handleData);
    };
  }, []);

  const handleAddTransaction = () => {
    if (!amount) {
      setSnackbarText('金額を入力してください。');
      return;
    }
    if (!currentUser) {
      setSnackbarText('ログインしてください。');
      return;
    }

    const transRef = ref(database, '/transactions');
    const newTrans = {
      amount,
      category,
      type,
      note,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      userId: currentUser.uid, // 将用户ID添加到事务数据中
      userEmail: currentUser.email,
    };
    push(transRef, newTrans).then(() => {
      setSnackbarText(
        `登録できました：
      金额: ${amount}円 
      カテゴリー: ${categories.find(c => c.id === category).name} 
      取引タイプ: ${transactionTypes.find(t => t.id === type).name}`,
      );
      setAmount('');
      setNote('');
      setDate(new Date());
      setCategory(categories[0].id);
      setType(transactionTypes[0].id);
      setIsRecurring(false);
    });

    if (isRecurring) {
      const recurringRef = ref(database, '/recurringTransactions');
      push(recurringRef, newTrans);
    }
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(false);
    setDate(currentDate);
  };

  const addToNote = text => {
    setNote(note ? `${note} ${text}` : text); // 如果已有文本，添加逗号和空格
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="金额"
        value={amount}
        onChangeText={text => setAmount(text)}
        keyboardType="numeric"
        mode="outlined"
        style={styles.amountInput}
      />

      <View style={styles.selectorContainer}>
        {categories.map(item => (
          <Button
            key={item.id}
            mode={category === item.id ? 'contained' : 'outlined'}
            onPress={() => setCategory(item.id)}
            style={styles.button}>
            {item.name}
          </Button>
        ))}
      </View>

      <Text style={styles.label}>取引タイプ:</Text>
      <View style={styles.selectorContainer}>
        {transactionTypes.map(item => (
          <Button
            key={item.id}
            compact={true}
            mode={type === item.id ? 'contained' : 'outlined'}
            onPress={() => setType(item.id)}
            style={styles.button}>
            {item.name}
          </Button>
        ))}
      </View>

      <TextInput
        label="メモ"
        value={note}
        onChangeText={text => setNote(text)}
        mode="outlined"
        style={styles.amountInput}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addToNote('ピーコック')}>
          <Text style={styles.buttonText}>ピーコック</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addToNote('ライフ')}>
          <Text style={styles.buttonText}>ライフ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addToNote('カメクロ')}>
          <Text style={styles.buttonText}>カメクロ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addToNote('タンパク質')}>
          <Text style={styles.buttonText}>タンパク質</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addToNote('野菜')}>
          <Text style={styles.buttonText}>野菜</Text>
        </TouchableOpacity>
        {/* 你可以根据需要添加更多的选项按钮 */}
      </View>

      <View style={styles.switchContainer}>
        <Text>定期追加:</Text>
        <Switch
          value={isRecurring}
          onValueChange={setIsRecurring}
          color="#6200ee"
        />
      </View>

      <Button
        mode="text"
        onPress={() => setDatePickerVisibility(true)}
        style={styles.dateButton}>
        {date.toISOString().split('T')[0]}
      </Button>
      {isDatePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <Button
        mode="contained"
        onPress={handleAddTransaction}
        style={styles.addButton}>
        つける
      </Button>
      <Snackbar
        visible={!!snackbarText}
        onDismiss={() => setSnackbarText('')}
        duration={6000}
        style={styles.snackbar}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  amountInput: {
    fontSize: 18,
    height: 55,
    marginBottom: 20,
  },
  dateButton: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  button: {
    minHeight: 10,
    minWidth: 40,
    paddingVertical: 1,
    paddingHorizontal: 1,
    borderRadius: 6,
    margin: 5,
  },
  addButton: {
    marginTop: 30,
    minHeight: 25,
    paddingVertical: 4,
    bottom: 18,
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    opacity: 0.85, // Adjusted for visibility
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default TransactionScreen;
