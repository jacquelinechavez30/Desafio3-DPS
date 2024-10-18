import React from 'react';
import { View, Text, Image, StyleSheet, Platform, StatusBar } from 'react-native';

const Header = () => {
  const logo = require('../img/Logo.png');
  return (
    <View style={styles.header}>
      <Image
        source={logo} 
        style={styles.image}
      />
      <Text style={styles.title}>CreditMate</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center', // Alinea los elementos horizontalmente
    padding: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Añadir paddingTop para Android
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;