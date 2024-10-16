import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert, TouchableOpacity, ActivityIndicator,StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Url from './Url';

export default  ProductosPersona = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [nombrePersona, setNombrePersona] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    obtenerNombrePersona();
    obtenerProductos();
  }, []);

  const obtenerNombrePersona = async () => {
    const nombre = await AsyncStorage.getItem('nombrePersona');
    setNombrePersona(nombre);
  };

  const obtenerProductos = async () => {
    try {
      const nombre = await AsyncStorage.getItem('nombrePersona');
      if (nombre) {
        const response = await axios.get(`${Url}/productos`, { params: { nombrePersona: nombre } });
        setProductos(response.data);
      }
    } catch (error) {
      console.log('Error al obtener productos:', error);
    } finally {
      setLoading(false); 
    }
  };

  const eliminarProducto = async (idProducto) => {
    try {
      await axios.delete(`${Url}/eliminarproducto/${idProducto}`);
      Alert.alert('Producto eliminado', 'El producto ha sido eliminado exitosamente.');
      obtenerProductos();
    } catch (error) {
      console.log('Error al eliminar producto:', error);
    }
  };

  

  const aprobarProducto = async (idProducto) => {
    console.log('Aprobando producto con ID:', idProducto); 
    try {
      await axios.put(`${Url}/editarproducto/${idProducto}`, {
        estado: 'Aprobado',
      });
      Alert.alert('Producto aprobado', 'El estado del producto ha sido actualizado a "Aprobado".');
      obtenerProductos(); 
    } catch (error) {
      console.error('Error al aprobar el producto:', error.response ? error.response.data : error.message);
    }
  };
  
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Productos de {nombrePersona}
      </Text>

      {loading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Cargando...</Text>
        </View>
      ) : (
        <>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <View key={producto._id} style={styles.productContainer}>
                <Text style={styles.productName}>{producto.nombreProducto}</Text>
                <Text style={styles.productStatus}>Estado: {producto.estado}</Text>
                <TouchableOpacity
                                    onPress={() => eliminarProducto(producto._id)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                {producto.estado !== 'Aprobado' && (
                  <TouchableOpacity onPress={() => aprobarProducto(producto._id)}>
                    <Text style={{ color: 'green', marginTop: 10 }}>Aprobar producto</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay productos registrados para esta persona.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
      flexDirection: 'column',
     
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginLeft: 20,
  },
  productContainer: {
      flexDirection: 'column',
      //justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 10,
  },
  productName: {
      fontSize: 18,
  },
  productStatus: {
      fontSize: 16,
      color: '#888',
  },
  deleteButton: {
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 5,
      
  },
  deleteButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign:'center'
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: 'gray',
  },
});
