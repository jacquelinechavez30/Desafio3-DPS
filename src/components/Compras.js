import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

export default function Compras() {
    const navigation = useNavigation();
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

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

    useEffect(() => {
        cargarProductosSeleccionados();
    }, []);

    const eliminarProducto = async (item) => {
        const nuevosProductos = productosSeleccionados.filter((producto) => producto !== item);
        setProductosSeleccionados(nuevosProductos);
        await AsyncStorage.setItem('productosSeleccionados', JSON.stringify(nuevosProductos));
    };

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
            <Button title="Finalizar Compra" onPress={() => navigation.navigate('Datos')} />

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
});
