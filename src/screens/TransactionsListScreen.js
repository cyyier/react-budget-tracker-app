import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import {database} from '../config/firebaseConfig';
import {ref, onValue, remove, off} from 'firebase/database';
import {categories, transactionTypes} from '../config/constants';
import {
  Card,
  Button,
  Paragraph,
  Title,
  TextInput,
  Snackbar,
} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';

const TransactionsListScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [totalAmount, setTotalAmount] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  const availableYears = ['all', '2024', '2025'];
  const months = [
    'all',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  const users = ['all', 'そそ', 'るみね'];

  useEffect(() => {
    const transRef = ref(database, '/transactions');
    const unsubscribe = onValue(
      transRef,
      snapshot => {
        try {
          const data = snapshot.val();
          if (data) {
            let formattedData = Object.keys(data).map(key => ({
              id: key,
              ...data[key],
              categoryName: categories.find(c => c.id === data[key].category)
                ?.name,
              typeName: transactionTypes.find(t => t.id === data[key].type)
                ?.name,
              date: new Date(data[key].date),
              userName:
                data[key].userEmail === 'cyouso@hotmail.com'
                  ? 'そそ'
                  : 'るみね',
            }));
            formattedData.sort((a, b) => b.date - a.date); // 假设使用日期排序，新日期在前
            setTransactions(formattedData);
            setFilteredTransactions(formattedData);
          } else {
            setTransactions([]);
            setFilteredTransactions([]);
          }
        } catch (error) {
          console.error('Error parsing transaction data:', error);
          setSnackbarText(`Error parsing data: ${error.message}`);
          setSnackbarVisible(true);
        }
      },
      error => {
        console.error('Error fetching transactions:', error);
        setSnackbarText(`Error fetching data: ${error.message}`);
        setSnackbarVisible(true);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleFilter = transactionsToFilter => {
    try {
      let filtered = transactions.filter(transaction => {
        const transactionYear = transaction.date.getFullYear().toString();
        const transactionMonth = (transaction.date.getMonth() + 1).toString();
        const amount = parseFloat(transaction.amount);
        const minAmountVal = parseFloat(minAmount) || 0;
        const maxAmountVal = parseFloat(maxAmount) || Infinity;

        return (
          (selectedUser === 'all' || transaction.userName === selectedUser) &&
          (selectedCategory === 'all' ||
            transaction.category === selectedCategory) &&
          (selectedType === 'all' || transaction.type === selectedType) &&
          amount >= minAmountVal &&
          amount <= maxAmountVal &&
          (selectedYear === 'all' || transactionYear === selectedYear) &&
          (selectedMonth === 'all' || transactionMonth === selectedMonth)
        );
      });
      setFilteredTransactions(filtered);
      calculateTotalAmount(filtered);
    } catch (error) {
      console.error('Error during filtering:', error);
      setSnackbarText(`Filtering error: ${error.message}`);
      setSnackbarVisible(true);
    }
  };

  const calculateTotalAmount = transactionitems => {
    const total = transactionitems.reduce(
      (sum, item) => sum + parseInt(item.amount, 10),
      0,
    );
    setTotalAmount(total);
  };

  const handleClearFilter = () => {
    setSelectedUser('all');
    setSelectedType('all');
    setSelectedCategory('all');
    setMinAmount('');
    setMaxAmount('');
    setSelectedYear('all');
    setSelectedMonth('all');
    setFilteredTransactions(transactions);
    calculateTotalAmount(transactions);
  };

  const handleDelete = id => {
    Alert.alert('削除確認', 'この取引を削除してもよろしいですか？', [
      {text: 'キャンセル', style: 'cancel'},
      {
        text: '削除',
        onPress: () => {
          remove(ref(database, `/transactions/${id}`))
            .then(() => {
              // 直接操作状态来移除项，并触发依赖于transactions的useEffect
              setTransactions(prevTransactions => {
                const updatedTransactions = prevTransactions.filter(
                  transaction => transaction.id !== id,
                );
                updatedTransactions.sort((a, b) => b.date - a.date); // 重新排序
                return updatedTransactions;
              });
            })
            .catch(error => {
              console.error('Error deleting transaction:', error);
              setSnackbarText(`Error deleting transaction: ${error.message}`);
              setSnackbarVisible(true);
            });
        },
      },
    ]);
  };

  useEffect(() => {
    // 这里将重新计算总金额
    const total = transactions.reduce(
      (sum, item) => sum + parseInt(item.amount, 10),
      0,
    );
    setTotalAmount(total);
  }, [transactions]); // 只有当transactions变化时，才重新计算

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedUser}
          style={styles.picker}
          onValueChange={itemValue => setSelectedUser(itemValue)}>
          {users.map(user => (
            <Picker.Item
              key={user}
              label={user === 'all' ? 'だれ' : `${user}`}
              value={user}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={itemValue => setSelectedYear(itemValue)}>
          {availableYears.map(year => (
            <Picker.Item
              key={year}
              label={year === 'all' ? '年' : `${year}年`}
              value={year}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={itemValue => setSelectedMonth(itemValue)}>
          {months.map(month => (
            <Picker.Item
              key={month}
              label={month === 'all' ? '月' : `${month}月`}
              value={month}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={itemValue => setSelectedCategory(itemValue)}>
          <Picker.Item label="カテゴリー" value="all" />
          {categories.map(category => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedType}
          style={styles.picker}
          onValueChange={itemValue => setSelectedType(itemValue)}>
          <Picker.Item label="タイプ" value="all" />
          {transactionTypes.map(type => (
            <Picker.Item key={type.id} label={type.name} value={type.id} />
          ))}
        </Picker>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          label="min"
          value={minAmount}
          onChangeText={setMinAmount}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          label="max"
          value={maxAmount}
          onChangeText={setMaxAmount}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.filterContainer}>
        <Button onPress={() => handleFilter(transactions)}>
          フィルターをかける
        </Button>
        <Button onPress={handleClearFilter}>フィルターをクリアする</Button>
      </View>
      <Text style={styles.totalAmount}>合計: ¥{totalAmount}</Text>
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>
                {item.categoryName} ￥{item.amount}{' '}
              </Title>
              <Paragraph>
                {`${item.userName}  →  ${item.typeName}`}
                {item.note && `\n${item.note}`}
                {`\n${item.date.getFullYear()}.${
                  item.date.getMonth() + 1
                }.${item.date.getDate()}`}{' '}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="text" onPress={() => handleDelete(item.id)}>
                削除
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  card: {
    marginVertical: 8,
  },
  picker: {
    flex: 1,
  },
  input: {
    flex: 1,
  },
  snackbar: {
    opacity: 0.85, // Adjusted for visibility
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deleteButton: {
    fontSize: 10,
  },
});

export default TransactionsListScreen;
