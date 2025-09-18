import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ColorChangerApp = ({ setBackgroundColor }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: 'pink' }]}
        onPress={() => setBackgroundColor('pink')}
      >
        <Text style={styles.btnText}>Pink</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: 'white' }]}
        onPress={() => setBackgroundColor('white')}
      >
        <Text style={styles.btnText}>White</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: 'lightgreen' }]}
        onPress={() => setBackgroundColor('lightgreen')}
      >
        <Text style={styles.btnText}>Light Green</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12, // space between buttons
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 150,
    alignItems: 'center',
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  btnText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ColorChangerApp;