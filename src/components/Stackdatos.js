import { View, Text } from 'react-native'
import React , { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  Datos from './Datos';
import ProductosPersona from './ProductosPersona';
import Header from './Header';

const Stack = createStackNavigator();

export default function Stackdatos() {
  return (

      <Stack.Navigator initialRouteName="Personas">
        <Stack.Screen
          name="Personas"
          component={Datos} 
          options={{  header: () => <Header /> }}
        />
        <Stack.Screen
        name="ProductosPersona"
        component={ProductosPersona} 
        options={{  header: () => <Header />}}
        />
      </Stack.Navigator>
  )
}