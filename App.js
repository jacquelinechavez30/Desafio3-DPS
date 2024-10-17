
import { StyleSheet, Text, StatusBar, View } from 'react-native';
import React , { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Stackdatos from './src/components/Stackdatos';
import Home from './src/components/Home';
import Productoofertas from './src/components/Productoofertas';
import Misproductos from './src/components/Misproductos';
import Miscompras from './src/components/Miscompras';
import Mapa from './src/components/Mapa';
import 'react-native-gesture-handler';
import Notificaciones from './src/components/Notificaciones';
import Icon from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

export default function App() {
  
  const styles = StyleSheet.create({
    tabBarLabel: {
      fontSize: 11,
      color: '#fff',
    },
    tabBar: {
      backgroundColor: '#002d70',
    },
    tabBarIcon: {
      color: '#fff',
      size: 10,
    },
  });

  return (

      <View style={{ flex: 1 }}>

      <StatusBar
        barStyle="dark-content" 
        backgroundColor="#0d6efd" 
      />

    <NavigationContainer>

      <Tab.Navigator
      initialRouteName="Stackdatos"
      screenOptions={{
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#feffff'}}>
        
        <Tab.Screen
        name="Stackdatos" 
        component={Stackdatos} 
        options={{ 
          title: 'Datos del Cliente',
          tabBarIcon: ({ color, size }) => (<Icon name="person" color={color} size={size}/>), headerShown: false }} />
          <Tab.Screen 
        name="Misproductos" 
        component={Miscompras} 
        options={{ 
          title: 'Mis productos',
          /*icono de  bolsa*/
          tabBarIcon: ({ color, size, }) => (<Icon name="bag" color={color} size={size} />) , headerShown: false }} />
       <Tab.Screen 
        name="Mapa" 
        component={Mapa} 
        options={{ 
          title: 'Mapa',
          tabBarIcon: ({ color, size, }) => (<Icon name="map" color={color} size={size} />), headerShown: false }} />
     {/* <Tab.Screen 
        name="Productoofertas" 
        component={Productoofertas} 
        options={{ 
          title: 'Productos y Ofertas',
          tabBarIcon: ({ color, size, }) => (<Icon name="gift" color={color} size={size} />), headerShown: false }} />*/}
       {/*<Tab.Screen
        name="Notificaciones"
        component={Notificaciones}
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, size }) => (<Icon name="notifications" color={color} size={size}/>), headerShown: false }} />*/ } 
    

      </Tab.Navigator>

      


    </NavigationContainer>

    </View>

  );
}