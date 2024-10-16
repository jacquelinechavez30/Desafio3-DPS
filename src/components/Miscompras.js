import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Url from './Url';

export default function Miscompras() {
    const [productos, setProductos] = useState([]);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [loading, setLoading] = useState(false);
    const url_get = Url + '/productos';
    const url_delete = Url + '/eliminarproducto/';

    const obtenerNombreCompleto = async () => {
        try {
            const nombre = await AsyncStorage.getItem('nombreCompleto');
            if (nombre) {
                setNombreCompleto(nombre);
                console.log('Nombre completo recuperado:', nombre);
            }
        } catch (error) {
            console.error('Error al recuperar el nombre completo:', error);
        }
    };

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(url_get, { params: { nombrePersona: nombreCompleto } });
            setProductos(response.data);
            console.log('Productos cargados:', response.data);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            Alert.alert('Error', 'Hubo un problema al cargar los productos.');
        } finally {
            setLoading(false);
        }
    };

    const eliminarProducto = async (idProducto) => {
        try {
            await axios.delete(`${url_delete}${idProducto}`);
            Alert.alert('Eliminado', 'Producto eliminado exitosamente.');
            cargarProductos();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            Alert.alert('Error', 'No se pudo eliminar el producto.');
        }
    };

    useEffect(() => {
        obtenerNombreCompleto();
    }, []);

    useEffect(() => {
        if (nombreCompleto) {
            cargarProductos();
        }
    }, [nombreCompleto]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Compras</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" />
            ) : (
                <ScrollView>
                    {productos.length > 0 ? (
                        productos.map((item) => (
                            <View key={item._id} style={styles.productContainer}>
                                <Text style={styles.productName}>Producto: {item.nombreProducto}</Text>
                                <Text style={styles.productStatus}>Estado: {item.estado}</Text>
                                <TouchableOpacity
                                    onPress={() => eliminarProducto(item._id)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No tienes productos registrados</Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
       
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    productName: {
        fontSize: 16,
    },
    productStatus: {
        fontSize: 16,
        color: '#888',
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
    },
});
