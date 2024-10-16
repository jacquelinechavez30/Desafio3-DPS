import { View, Text } from 'react-native'
import React , { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ingresos from './Ingresos'; // Importa el archivo Ingresos.js
import Egresos from './Egresos';
import Graficas from './Graficas'
import Home from './Home';
import Compra from './Compras';
import Miscompras from './Miscompras';
import  Datos from './Datos';
import Productoofertas from './Productoofertas';

const Stack = createStackNavigator();

export default function Stackdatos() {
  return (

      <Stack.Navigator initialRouteName="Datos">
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
        <Stack.Screen
        name="Productoofertas"
        component={Productoofertas} // Usa el componente Productoofertas
        options={{ title: 'Productos en Oferta' }}
        />
        <Stack.Screen
        name="Miscompras"
        component={Miscompras} // Usa el componente  Miscompras
        options={{ title: 'Mis Compras' }}
        />
        <Stack.Screen
        name="Compras"
        component={Compra} // Usa el componente Compra
        options={{ title: 'Compras' }}
        />
        <Stack.Screen
        name="Datos"
        component={Datos} // Usa el componente Datos
        options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
  )
}