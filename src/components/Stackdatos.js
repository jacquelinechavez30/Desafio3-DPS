import { View, Text } from 'react-native'
import React , { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ingresos from './Ingresos'; // Importa el archivo Ingresos.js
import Egresos from './Egresos';
import Graficas from './Graficas'
import Home from './Home';


const Stack = createStackNavigator();

export default function Stackdatos() {
  return (

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="FormularioIngreso"
          component={Ingresos} // Usa el componente Ingresos
          options={{ title: 'Ingresos' }}
        />
        <Stack.Screen
        name="FormularioEgresos"
        component={Egresos} // Usa el componente Egresos
        options={{ title: 'Egresos' }}
        />
        <Stack.Screen
          name="Graficas"
          component={Graficas} // Usa el componente Grafica
          options={{ title: 'Gráficas' }}
        />
         <Stack.Screen
          name="Home"
          component={Home} // Usa el componente Grafica
          options={{ title: 'Inicio' }}
        />
      </Stack.Navigator>
  )
}