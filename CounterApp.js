import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Counter App</Text>
      <Text style={styles.count}>{count}</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: 'black' }]} // green
          onPress={() => setCount(c => c + 1)}
        >
          <Text style={styles.btnText}>Increment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: 'black' }]} // red
          onPress={() => setCount(c => c - 1)}
        >
          <Text style={styles.btnText}>Decrement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12, // spacing between buttons
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});