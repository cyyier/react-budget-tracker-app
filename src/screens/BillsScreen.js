import React, {useState, useEffect} from 'react';
import {View, FlatList, Text, StyleSheet, Button, Alert} from 'react-native';
import {database} from '../config/firebaseConfig';
import {ref, onValue, remove} from 'firebase/database';

const BillsScreen = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const billsRef = ref(database, '/bills');
    const unsubscribe = onValue(billsRef, snapshot => {
      const data = snapshot.val() ? Object.values(snapshot.val()) : [];
      setBills(data);
    });
    return () => unsubscribe();
  }, []);

  const deleteBill = id => {
    const billRef = ref(database, `/bills/${id}`);
    remove(billRef)
      .then(() => Alert.alert('成功', '账单已删除'))
      .catch(error => Alert.alert('错误', error.message));
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.text}>
        {item.description} - ¥{item.amount}
      </Text>
      <View style={styles.buttons}>
        <Button
          title="编辑"
          onPress={() => {
            /* 编辑逻辑 */
          }}
        />
        <Button title="删除" onPress={() => deleteBill(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bills}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
  },
});

export default BillsScreen;
