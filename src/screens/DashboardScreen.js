/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
// src/components/Dashboard.js
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';
import {BarChart, PieChart} from 'react-native-chart-kit';
import {database} from '../config/firebaseConfig';
import {categories, transactionTypes} from '../config/constants';
const screenWidth = Dimensions.get('window').width;
import {ref, onValue, remove, off} from 'firebase/database';
import {Text, useTheme, DataTable} from 'react-native-paper';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
const years = ['年', '2024', '2025'];
const months = [
  '月',
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
const Dashboard = () => {
  const theme = useTheme(); // 获取当前主题
  const [transactions, setTransactions] = useState([]);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month() + 1);
  const [viewMode, setViewMode] = useState('month'); // 'year' or 'month'
  const [chartViewMode, setChartViewMode] = useState('categoryPieData'); // 'year' or 'month'
  const [summary, setSummary] = useState({
    soso: {income: 0, expense: 0},
    rumine: {income: 0, expense: 0},
    shared: {income: 0, expense: 0},
  });
  const [expenseSummary, setExpenseSummary] = useState({
    そそ: 0,
    るみね: 0,
    ふたり: 0,
  });
  const [contribution, setContribution] = useState({
    soso: 0,
    rumine: 0,
  });
  const [categorySummary, setCategorySummary] = useState({
    食費: 0,
    交通: 0,
    住宅: 0,
    娯楽: 0,
    教育: 0,
    医療: 0,
    '衣服・美容': 0,
    '光熱・水道': 0,
    通信: 0,
    その他: 0,
    交際費: 0,
  });
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
            }));
            setTransactions(formattedData);
            calculateSummary(
              formattedData,
              year,
              viewMode === 'month' ? month : null,
            );
          } else {
            setTransactions([]);
          }
        } catch (error) {
          console.error('Error parsing transaction data:', error);
        }
      },
      error => {
        console.error('Error fetching transactions:', error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!year) {
      setYear(moment().year());
    }
    if (!month) {
      setMonth(moment().month() + 1);
    }
    calculateSummary(transactions, year, viewMode === 'month' ? month : null);
  }, [year, month, transactions, viewMode]);

  const calculateSummary = (transactions, year, month) => {
    if (!year) {
      year = moment().year();
    }
    const summary = {
      soso: {income: 0, expense: 0},
      rumine: {income: 0, expense: 0},
      shared: {income: 0, expense: 0},
    };
    const expenseSummary = {
      そそ: 0,
      るみね: 0,
      ふたり: 0,
    };
    const contribution = {
      soso: 0,
      rumine: 0,
    };
    const categorySummary = {
      食費: 0,
      交通: 0,
      住宅: 0,
      娯楽: 0,
      教育: 0,
      医療: 0,
      '衣服・美容': 0,
      '光熱・水道': 0,
      通信: 0,
      その他: 0,
      交際費: 0,
    };
    transactions.forEach(transaction => {
      const {amount, typeName, userEmail, categoryName, date} = transaction;
      const amountNum = parseFloat(amount);
      const transactionYear = date.getFullYear().toString();
      const transactionMonth = (date.getMonth() + 1).toString();
      const user = userEmail === 'cyouso@hotmail.com' ? 'soso' : 'rumine';
      const otherUser = user === 'soso' ? 'rumine' : 'soso';
      if (
        transactionYear == year &&
        (month === null || transactionMonth == month)
      ) {
        if (typeName === '収入') {
          summary[user].income += amountNum;
        } else if (typeName === '送金') {
          summary[user].expense += amountNum;
          summary[otherUser].expense -= amountNum;
        } else {
          summary[user].expense += amountNum;
        }
        if (
          typeName === 'ふたり' ||
          typeName === 'るみね' ||
          typeName === 'そそ'
        ) {
          expenseSummary[typeName] += amountNum;
        }
        if (typeName === 'ふたり') {
          contribution[user] += amountNum;
        }
        if (typeName === otherUser || typeName === '送金') {
          contribution[user] += amountNum * 2;
        }
        if (typeName !== '送金' && typeName !== '収入') {
          categorySummary[categoryName] += amountNum;
        }
      }
    });
    summary.shared.income = summary.soso.income + summary.rumine.income;
    summary.shared.expense = summary.soso.expense + summary.rumine.expense;
    const contributionAll = contribution.soso + contribution.rumine;
    contribution.soso = parseFloat(
      (contribution.soso / contributionAll).toFixed(2),
    );
    contribution.rumine = parseFloat(
      (contribution.rumine / contributionAll).toFixed(2),
    );
    setSummary(summary);
    setExpenseSummary(expenseSummary);
    setContribution(contribution);
    setCategorySummary(categorySummary);
  };
  const formatNumber = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const expensePieData = [
    {
      name: 'そそ',
      population: expenseSummary['そそ'],
      color: '#FFCDD2',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'るみね',
      population: expenseSummary['るみね'],
      color: '#BBDEFB', // 蓝色
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'ふたり',
      population: expenseSummary['ふたり'],
      color: '#E0E0E0', // 蓝色
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
  ];

  const contributionPieData = [
    {
      name: 'そそ',
      population: contribution.soso,
      color: '#FFCDD2',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'るみね',
      population: contribution.rumine,
      color: '#BBDEFB', // 蓝色
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
  ];

  const categoryPieData = [
    {
      name: '食費',
      population: categorySummary['食費'],
      color: '#FFCDD2',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: '交通',
      population: categorySummary['交通'],
      color: '#BBDEFB', // 蓝色
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: '住宅',
      population: categorySummary['住宅'],
      color: '#A5D6A7',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: '教育',
      population: categorySummary['教育'],
      color: '#CE93D8', // 蓝色
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: '医療',
      population: categorySummary['医療'],
      color: '#FFCC80',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: '衣服・美容',
      population: categorySummary['衣服・美容'],
      color: '#FFF59D', // 蓝色
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: '光熱・水道',
      population: categorySummary['光熱・水道'],
      color: '#EF9A9A',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: '通信',
      population: categorySummary['通信'],
      color: '#E0E0E0', // 蓝色
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'その他',
      population: categorySummary['その他'],
      color: '#80DEEA',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: '交際費',
      population: categorySummary['交際費'],
      color: '#BCAAA4', // 蓝色
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => theme.colors.text,
    labelColor: (opacity = 1) => theme.colors.text,
  };
  const calculateBalance = (income, expense) => income - expense;
  const getChartData = () => {
    switch (chartViewMode) {
      case 'categoryPieData':
        return categoryPieData;
      case 'expensePieData':
        return expensePieData;
      case 'contributionPieData':
        return contributionPieData;
      default:
        return categoryPieData;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={year}
          style={styles.picker}
          onValueChange={itemValue => setYear(itemValue)}>
          {years.map((year, index) => (
            <Picker.Item key={index} label={`${year}`} value={year} />
          ))}
        </Picker>

        <Picker
          selectedValue={month}
          style={styles.picker}
          onValueChange={itemValue => setMonth(itemValue)}>
          {months.map((month, index) => (
            <Picker.Item key={index} label={`${month}`} value={month} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: viewMode === 'year' ? theme.colors.primary : '#999',
            },
          ]}
          onPress={() => setViewMode('year')}>
          <Text
            style={[
              styles.buttonText,
              {color: viewMode === 'year' ? theme.colors.primary : '#999'},
            ]}>
            年次
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: viewMode === 'month' ? theme.colors.primary : '#999',
            },
          ]}
          onPress={() => setViewMode('month')}>
          <Text
            style={[
              styles.buttonText,
              {color: viewMode === 'month' ? theme.colors.primary : '#999'},
            ]}>
            月次
          </Text>
        </TouchableOpacity>
        <Text>　　</Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor:
                chartViewMode === 'categoryPieData'
                  ? theme.colors.primary
                  : '#999',
            },
          ]}
          onPress={() => setChartViewMode('categoryPieData')}>
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  chartViewMode === 'categoryPieData'
                    ? theme.colors.primary
                    : '#999',
              },
            ]}>
            何に
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor:
                chartViewMode === 'expensePieData'
                  ? theme.colors.primary
                  : '#999',
            },
          ]}
          onPress={() => setChartViewMode('expensePieData')}>
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  chartViewMode === 'expensePieData'
                    ? theme.colors.primary
                    : '#999',
              },
            ]}>
            誰に
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor:
                chartViewMode === 'contributionPieData'
                  ? theme.colors.primary
                  : '#999',
            },
          ]}
          onPress={() => setChartViewMode('contributionPieData')}>
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  chartViewMode === 'contributionPieData'
                    ? theme.colors.primary
                    : '#999',
              },
            ]}>
            貢献度
          </Text>
        </TouchableOpacity>
      </View>

      <PieChart
        data={getChartData()}
        width={screenWidth - 32}
        height={260}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <DataTable style={styles.dataTable}>
        <DataTable.Header style={styles.dataTableHeader}>
          <DataTable.Title style={styles.dataTableTitle} />
          <DataTable.Title style={styles.dataTableTitle} numeric>
            收入
          </DataTable.Title>
          <DataTable.Title style={styles.dataTableTitle} numeric>
            支出
          </DataTable.Title>
          <DataTable.Title style={styles.dataTableTitle} numeric>
            收支
          </DataTable.Title>
        </DataTable.Header>

        <DataTable.Row style={styles.dataTableRow}>
          <DataTable.Cell style={styles.dataTableCell}>ふたり</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(summary.shared.income)}
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(summary.shared.expense)}
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(
              calculateBalance(summary.shared.income, summary.shared.expense),
            )}
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row style={styles.dataTableRow}>
          <DataTable.Cell style={styles.dataTableCell}>るみね</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(summary.rumine.income)}
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(summary.rumine.expense)}
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(
              calculateBalance(summary.rumine.income, summary.rumine.expense),
            )}
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row style={styles.dataTableRow}>
          <DataTable.Cell style={styles.dataTableCell}>そそ</DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(summary.soso.income)}
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(summary.soso.expense)}
          </DataTable.Cell>
          <DataTable.Cell style={styles.dataTableCell} numeric>
            {formatNumber(
              calculateBalance(summary.soso.income, summary.soso.expense),
            )}
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 1,
  },
  button: {
    paddingVertical: 0,
    paddingHorizontal: 5,

    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '16%', // 设置相同的宽度
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataTable: {
    width: '90%',
    height: 195,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dataTableHeader: {
    backgroundColor: '#f1f1f1',
    height: 50,
  },
  dataTableTitle: {
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  dataTableRow: {
    height: 40,
  },
  dataTableCell: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default Dashboard;
