import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function Graficas() {
  const navigation = useNavigation();
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const screenWidth = Dimensions.get('window').width;

  // Función para mostrar los datos
  const cargarDatosStorage = async () => {
    try {
      const ingresosJSON = await AsyncStorage.getItem('ingresos');
      const egresosJSON = await AsyncStorage.getItem('egresos');
      if (ingresosJSON !== null) {
        setIngresos(JSON.parse(ingresosJSON));
      }
      if (egresosJSON !== null) {
        setEgresos(JSON.parse(egresosJSON));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const guardarTotalesStorage = async (totalIngresos, totalEgresos) => {
    try {
      await AsyncStorage.setItem('totalIngresos', JSON.stringify(totalIngresos));
      await AsyncStorage.setItem('totalEgresos', JSON.stringify(totalEgresos));
    } catch (error) {
      console.log(error);
    }
  };

 

  useEffect(() => {
    cargarDatosStorage();
  }, []);

  console.log('Ingresos en Graficas:', ingresos);
  console.log('Egresos en Graficas:', egresos);


  useEffect(() => {
    // Calcular totales y guardarlos en AsyncStorage
    const totalIngresos = ingresos.reduce((sum, ingreso) => sum + parseFloat(ingreso.monto), 0);
    const totalEgresos = egresos.reduce((sum, egreso) => sum + parseFloat(egreso.monto), 0);
    
    guardarTotalesStorage(totalIngresos, totalEgresos);
  }, [ingresos, egresos]);

  // Procesar los ingresos y egresos para generar los datos del gráfico
  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + parseFloat(ingreso.monto), 0);
  const totalEgresos = egresos.reduce((sum, egreso) => sum + parseFloat(egreso.monto), 0);

  const dataPie = [
    {
      name: 'Ingresos',
      total: totalIngresos,
      color: '#1e78fd',
      legendFontColor: '#000',
      legendFontSize: 15,
    },
    {
      name: 'Egresos',
      total: totalEgresos,
      color: '#ff8c00',
      legendFontColor: '#000',
      legendFontSize: 15,
    },
  ];

  const styles = StyleSheet.create({
    Text: {
      margin: 10,
      fontWeight: 'bold',
    },
    Container: {
      backgroundColor: '#f8f9fa',
    },
    separator: {
      height: 1,
      backgroundColor: '#000',
      marginVertical: 10,
      marginLeft: 25,
      marginRight: 25,
    },
    containerGrafica: {
      backgroundColor: '#FFFF05',
      alignItems: 'center',
      margin: 5,
      borderRadius: 10,
      padding: 5,
    },
  });

  return (
    <View>
      <Text style={styles.Text}>¡Analiza tus estadísticas!</Text>

      <Text style={styles.Text}>Gráfica Comparativa de Ingresos y Egresos:</Text>
      <PieChart
        data={dataPie}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          backgroundColor: '#fff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
        }}
        accessor="total"
        backgroundColor="transparent"
        paddingLeft="15"
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* Botón para ir a productos ofertados */}
      <TouchableOpacity
        style={styles.containerGrafica}
        onPress={() => navigation.navigate('Productoofertas')}
      >
        <Text style={{ color: '#212529', marginBottom: 8, fontWeight: 'bold' }}>Productos Ofertados</Text>
        <Icon name="shopping-cart" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}
