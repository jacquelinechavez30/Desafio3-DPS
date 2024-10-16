import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default Header = () => {
  const logo = require('../img/Logo.png');
  return (
    <View style={styles.header}>
      <Image
        source={logo} 
        style={styles.image}
      />
      <Text style={styles.title}>CrediMate_Administrador</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    backgroundColor: '#fff', 
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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


