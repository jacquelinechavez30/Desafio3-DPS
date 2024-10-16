import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Url from './Url';

export default function Misproductos() {
    const [productos, setProductos] = useState([]);
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const url_get = Url + '/productos';
    const url_delete = Url + '/eliminarproducto/';

    const obtenerNombreCompleto = async () => {
        try {
            const nombre = await AsyncStorage.getItem('nombreCompleto');
            if (nombre) {
                setNombreCompleto(nombre);
                console.log('Nombre completo recuperado:', nombre);
            } else {
                // Si nombreCompleto está vacío, solicitar el nombre al usuario
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error al recuperar el nombre completo:', error);
        }
    };

    const guardarNombre = async () => {
        if (nuevoNombre.trim()) {
            await AsyncStorage.setItem('nombreCompleto', nuevoNombre);
            setNombreCompleto(nuevoNombre);
            setNuevoNombre(''); // Limpiar el campo de texto
            setModalVisible(false); // Cerrar el modal
        } else {
            Alert.alert('Error', 'Por favor, ingrese un nombre válido.');
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
            cargarProductos(); // Recargar productos después de eliminar
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
                <FlatList
                    data={productos}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productContainer}>
                            <Text style={styles.productName}>Producto: {item.nombreProducto}</Text>
                            <Text style={styles.productStatus}>Estado: {item.estado}</Text>
                            <TouchableOpacity
                                onPress={() => eliminarProducto(item._id)}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteButtonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No tienes productos registrados</Text>}
                />
            )}

            {/* Modal para ingresar el nombre */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ingrese su nombre completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre completo"
                            value={nuevoNombre}
                            onChangeText={setNuevoNombre}
                        />
                        <Button title="Guardar" onPress={guardarNombre} />
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});
