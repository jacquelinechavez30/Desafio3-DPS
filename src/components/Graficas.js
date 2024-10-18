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

  return (
    <View style={styles.Container}>
      <Text style={styles.Text}>¡Analiza tus estadísticas!</Text>
      <View style={styles.separator} />
      <View style={styles.chartContainer}>
      <Text style={styles.chartText}>Gráfica Comparativa de tus Ingresos y Egresos:</Text>
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
      />
      </View>
      <View style={styles.separator}/>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop:10}}>
      <TouchableOpacity style={styles.botonMenu} onPress={() => navigation.navigate('FormularioEgresos')}>
          <Text style={{ color: 'white', fontWeight:'bold'}}>
            <Icon name='arrow-left'></Icon>  Volver</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botonMenu} onPress={() => navigation.navigate('Productoofertas')}>
        <Text style={{ color: 'white', fontWeight:'bold' }}>
          <Icon name="shopping-cart" size={15} color="white" /> Productos ofertados  <Icon name='arrow-right'/></Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  Text: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  Container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    paddingHorizontal: 180,
    marginBottom: 0,
    marginTop: -20,
  },
  chartContainer: {
    width: 'auto',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  botonMenu: {
    backgroundColor: '#002d70',
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 1,
    paddingBottom: 6,
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
});