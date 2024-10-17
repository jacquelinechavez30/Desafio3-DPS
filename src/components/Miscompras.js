import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Url from './Url';
import Icon from 'react-native-vector-icons/FontAwesome/';
import { useNavigation } from '@react-navigation/native';
import Mapa from './Mapa';

export default function Miscompras() {
    const [productos, setProductos] = useState([]);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [loading, setLoading] = useState(false);
    const navigator = useNavigation();

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


    const renderProducto = (item) => {
        let icono = null;

        
        if (item.nombreProducto.includes('Apertura de cuenta')) {
            icono = <Icon name="user" size={24} color="blue" />;
        } else if (item.nombreProducto.includes('Crédito personal hasta')) {
            icono = <Icon name="money" size={24} color="green" />;
        } else if (item.nombreProducto.includes('Tarjeta')) {
            icono = <Icon name="credit-card" size={24} color="orange" />;
        }
        return (
            <View key={item._id} style={styles.productContainer}>
                <Text style={styles.productName}> Producto: {item.nombreProducto} {icono}</Text>
                <Text style={styles.productStatus}>Estado: {item.estado}</Text>
                <TouchableOpacity
                    onPress={() => eliminarProducto(item._id)}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
                {item.estado === 'aprobado' ? (
                    <TouchableOpacity
                        style={styles.botonToMapa}
                        onPress={() => navigator.navigate('Mapa')}
                    >
                        <Text style={styles.textToMapa}>Ver ubicaciones de entrega</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Compras
               { /*Icono de compra*/}
                <Icon name="shopping-cart" size={30} color="black" />
            </Text>
            {loading ? (
                <ActivityIndicator size="large" color="#2196F3" />
            ) : (
                <ScrollView>
                    {productos.length > 0 ? (
                        productos.map(renderProducto)
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
        backgroundColor: 'red',
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
    botonToMapa: {
        backgroundColor: '#002d70',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    textToMapa: {
        color: '#fff',
        fontSize: 12,
        //negrita
        fontWeight: 'bold',
    },
});
