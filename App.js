import { StyleSheet, Text, StatusBar, View } from 'react-native';
import React , { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Stackdatos from './src/components/Stackdatos';
import Home from './src/components/Home';
import Miscompras from './src/components/Miscompras';
import 'react-native-gesture-handler';
import Notificaciones from './src/components/Notificaciones';
import Icon from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

export default function App() {
  
  return (

  <View style={{ flex: 1 }}>
    <NavigationContainer>
      <Tab.Navigator
      initialRouteName="Stackdatos"
      screenOptions={() => ({
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBar,
      })}>
        
      <Tab.Screen
      name="Stackdatos" 
      component={Stackdatos} 
      options={{ 
      title: 'Inicio',
      tabBarIcon: ({ color, size }) => (<Icon name="home" color={color} size={size}/>), headerShown: false }} />
      
      <Tab.Screen 
      name="Misproductos" 
      component={Miscompras} 
      options={{ 
      title: 'Mis productos',
      tabBarIcon: ({ color, size, }) => (<Icon name="bag" color={color} size={size} />) , headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  </View>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 11,
    color: '#fff',
  },
  tabBar: {
    backgroundColor: '#002d70',
    borderTopWidth: 0,
    paddingTop: 7,
    paddingBottom: 5,
  },
  tabBarIcon: {
    color: '#fff',
    size: 10,
  },
});