import axios from 'axios';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity,  Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Url from './Url';

export default function Compras() {
    const navigation = useNavigation();
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [loading, setLoading] = useState(false);
    const url_post = Url + '/crearProducto';

    const cargarProductosSeleccionados = async () => {
        try {
            const productosJSON = await AsyncStorage.getItem('productosSeleccionados');
            if (productosJSON) {
                const productosData = JSON.parse(productosJSON);
                setProductosSeleccionados(productosData);
                console.log('Productos cargados:', productosData);
            }
        } catch (error) {
            console.error('Error al cargar productos seleccionados:', error);
            
        }

    };
    const obtenerNombreCompleto = async () => {
        try {
            const nombre = await AsyncStorage.getItem('nombreCompleto');
            if (nombre !== null) {
                setNombreCompleto(nombre);
                console.log('Nombre completo recuperado:', nombre);
            }
        } catch (error) {
            console.error('Error al recuperar el nombre completo:', error);
        }
    };

    useEffect(() => {
        cargarProductosSeleccionados();
        obtenerNombreCompleto();
    }, []);

    const eliminarProducto = async (item) => {
        const nuevosProductos = productosSeleccionados.filter((producto) => producto !== item);
        setProductosSeleccionados(nuevosProductos);
        await AsyncStorage.setItem('productosSeleccionados', JSON.stringify(nuevosProductos));
    };
    async function finalizarcompra(values) {
    
        //conectando ala api 
        try {
            setLoading(true);
            const promises = productosSeleccionados.map(async (producto) => {
                return axios.post(url_post, {
                    nombrePersona: nombreCompleto, 
                    nombreProducto: producto 
                });
          });
          await Promise.all(promises);
          Alert.alert('¡Éxito!', 'La compra se ha realizado exitosamente.');
          navigation.navigate('Misproductos');
        } catch (error) {
          const errorMessage = error?.response?.data?.message || 'Problemas al realizar la compra intenta mas tarde';
      Alert.alert('¡ERROR!', errorMessage);
        console.error('Error al realizar la compra:', error);
        console.error('Detalles del error:', error.response || error.message);
      console.error(error);
        }
     finally {
        setLoading(false); 
    }
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Productos Seleccionados</Text>
            <FlatList
                data={productosSeleccionados}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => 
                    <View style={styles.productContainer}>
                        <Text style={styles.product}>{item}</Text>
                        <TouchableOpacity onPress={() => eliminarProducto(item)}>
                            <Text style={styles.deleteButton}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                }
                ListEmptyComponent={() => <Text style={styles.emptyText}>No hay productos seleccionados</Text>}
            />
            <Button title="Finalizar Compra" onPress={finalizarcompra} disabled={loading}/>
            {loading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Cargando... espera unos segundos</Text>
            </View>
        )}
        </View>

    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 5,
    },
    product: {
        marginBottom: 5,
    },
    deleteButton: {
        color: 'red',
        fontWeight: 'bold',
    },
    emptyText: {
        marginTop: 20,
        color: 'gray',
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 16,
    },
});
