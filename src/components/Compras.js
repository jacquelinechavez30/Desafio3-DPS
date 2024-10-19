import axios from 'axios';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity,  Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome/';
import Url from './Url';
import { Formik } from 'formik';

export default function Compras() {

    const navigation = useNavigation();
    //productos seleccionados
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nombreCompletoA, setNombreCompletoA] = useState('');
    const [expoPushToken, setExpoPushToken] = useState(null);
    const url_post = Url + '/crearProducto';

    useEffect(() => {
        const fetchPushToken = async () => {
            const token = await AsyncStorage.getItem('expoPushToken');
        /*para obtener solo los de los [ ] por que el fomato que tenia era ExponentPushToken[jlfnawFRQ98p17NSixMihF]*/  
        // if (token) {
            // Extraer solo el contenido entre los corchetes
           // const formattedToken = token.match(/\[(.*?)\]/);
           // if (formattedToken) {
                //setExpoPushToken(formattedToken[1]); // Guarda solo lo que está dentro de los corchetes
          //  }
        setExpoPushToken(token);
          //}/*FIN para obtener solo los de los [ ]*/
        };
        fetchPushToken();
    }, []);

    //FUNCIONES DE PRODUCTOS

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
                setNombreCompletoA(nombre);
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

    async function finalizarCompra(values) {
        try {
            setLoading(true);
            const promises = productosSeleccionados.map(async (producto) => {
                return axios.post(url_post, {
                    nombrePersona: nombreCompletoA, 
                    nombreProducto: producto 
                });
            });
            await Promise.all(promises);
            Alert.alert('¡Éxito!', 'La compra se ha realizado exitosamente.');
            navigation.navigate('Miscompras');
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
    <>
        <Formik
                onSubmit={finalizarCompra}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <View style={styles.mainContainer}>
                            <Text style={styles.title}>Productos Seleccionados</Text>
                            <FlatList
                            data={productosSeleccionados}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <View style={styles.productContainer}>
                                <Text style={styles.product}>{item}</Text>
                                <TouchableOpacity onPress={() => eliminarProducto(item)}>
                                    <Text style={styles.deleteButton}>Eliminar</Text>
                                </TouchableOpacity>
                        </View>
                        }
                        ListEmptyComponent={() => <Text style={styles.emptyText}>No hay productos seleccionados</Text>} />
                        
                        <Button title="Finalizar Compra" onPress={handleSubmit} disabled={loading} />
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#2196F3" />
                                <Text style={styles.loadingText}>Cargando... espera unos segundos</Text>
                            </View>
                        )}
                        </View>
                    </>
                )}
        </Formik>
    </>
    );
}

const styles = StyleSheet.create({
    contGeneral: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
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
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },
});
