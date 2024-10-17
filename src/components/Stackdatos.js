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
import Mapa from './Mapa';
import Productoofertas from './Productoofertas';
import Notificaciones from './Notificaciones';
import Header from './Header';

const Stack = createStackNavigator();

export default function Stackdatos() {
  return (

      <Stack.Navigator initialRouteName="Notificaciones">
        <Stack.Screen
          name="FormularioIngreso"
          component={Ingresos} // Usa el componente Ingresos
          options={{ header: () => <Header />}}
        />
        <Stack.Screen
        name="FormularioEgresos"
        component={Egresos} // Usa el componente Egresos
        options={{ header: () => <Header /> }}
        />
        <Stack.Screen
          name="Graficas"
          component={Graficas} // Usa el componente Grafica
          options={{header: () => <Header /> }}
        />
         <Stack.Screen
          name="Home"
          component={Home} // Usa el componente Grafica
          options={{ header: () => <Header /> }}
        />
        <Stack.Screen
        name="Productoofertas"
        component={Productoofertas} // Usa el componente Productoofertas
        options={{header: () => <Header /> }}
        />
        <Stack.Screen
        name="Miscompras"
        component={Miscompras} // Usa el componente  Miscompras
        options={{ header: () => <Header /> }}
        />
        <Stack.Screen
        name="Compras"
        component={Compra} // Usa el componente Compra
        options={{ header: () => <Header /> }}
        />
        <Stack.Screen
        name="Datos"
        component={Datos} // Usa el componente Datos
        options={{ header: () => <Header /> }}
        />
        <Stack.Screen

        name="Notificaciones"
        component={Notificaciones} // Usa el componente Notificaciones
        options={{ header: () => <Header /> }}
        />

<Stack.Screen
        name="Mapa"
        component={Mapa}
        options={{ headerShown: false }}
        />

        
      </Stack.Navigator>
  )
}