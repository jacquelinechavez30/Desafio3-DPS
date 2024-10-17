import { ScrollView, View, Text, Button, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tarjeta from './Tarjeta';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Productoofertas() {
    const navigation = useNavigation();
    const [ingresos, setIngresos] = useState([]);
    const [egresos, setEgresos] = useState([]);
    const [ofertas, setOfertas] = useState([]);

    const cargarDatosStorage = async () => {
        try {
            const ingresosJSON = await AsyncStorage.getItem('ingresos');
            const egresosJSON = await AsyncStorage.getItem('egresos');
            if (ingresosJSON) {
                const ingresosData = JSON.parse(ingresosJSON);
                setIngresos(ingresosData);
                console.log('Ingresos:', ingresosData);
            }
            if (egresosJSON) {
                const egresosData = JSON.parse(egresosJSON);
                setEgresos(egresosData);
                console.log('Egresos:', egresosData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        cargarDatosStorage();
    }, []);

    const calcularTotales = () => {
        const totalIngresos = ingresos.reduce((acc, ingreso) => acc + parseFloat(ingreso.monto || 0), 0);
        const totalEgresos = egresos.reduce((acc, egreso) => acc + parseFloat(egreso.monto || 0), 0);
        console.log('Total Ingresos:', totalIngresos);
        console.log('Total Egresos:', totalEgresos);
        return { totalIngresos, totalEgresos };
    };

    const sobraPorcentaje = (totalI, totalE) => {
        return (((totalI - totalE) * 100) / totalI);
    };

    const rangosRiesgo = (totalIngresos, totalEgresos) => {
        if (totalIngresos <= 360) {
            return ['Apertura de cuenta'];
        } else if (totalIngresos <= 700) {
            return sobraPorcentaje(totalIngresos, totalEgresos) <= 40
                ? ['Apertura de cuenta']
                : ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Crédito personal hasta $2,000.00'];
        } else if (totalIngresos <= 1200) {
            if (sobraPorcentaje(totalIngresos, totalEgresos) <= 20) {
                return ['Apertura de cuenta'];
            } else if (sobraPorcentaje(totalIngresos, totalEgresos) <= 40) {
                return ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Crédito personal hasta $2,000.00'];
            } else {
                return ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Crédito personal hasta $8,000.00'];
            }
        } else if (totalIngresos <= 3000) {
            return sobraPorcentaje(totalIngresos, totalEgresos) <= 20
                ? ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Crédito personal hasta $2,000.00']
                : ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Tarjeta de crédito Platinum', 'Crédito personal hasta $25,000.00'];
        } else {
            return sobraPorcentaje(totalIngresos, totalEgresos) <= 20
                ? ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Crédito personal hasta $8,000.00']
                : ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Tarjeta de crédito Platinum', 'Tarjeta de crédito Black', 'Crédito personal hasta $50,000.00'];
        }
    };

    useEffect(() => {
        const { totalIngresos, totalEgresos } = calcularTotales();
        const nuevasOfertas = rangosRiesgo(totalIngresos, totalEgresos);
        console.log('Nuevas Ofertas:', nuevasOfertas);
        setOfertas(nuevasOfertas);
    }, [ingresos, egresos]);

    const ofertasFiltradas = ofertas.filter(oferta => oferta.includes('Tarjeta de'));
    const Clasica = ofertasFiltradas.includes('Tarjeta de Crédito Clásica');
    const Oro = ofertasFiltradas.includes('Tarjeta de Crédito Oro');
    const Platinum = ofertasFiltradas.includes('Tarjeta de crédito Platinum');
    const Black = ofertasFiltradas.includes('Tarjeta de crédito Black');

    const TarjetasCredito = () => {
        return (
            <View>
                {Clasica && (
                    <View style={styles.tarjetasContainer}>
                        <Text>Tarjeta de Crédito Clásica</Text>
                        <Tarjeta tipo="Clasica" />
                        <Button title="Seleccionar" onPress={() => seleccionarProducto("Tarjeta de Crédito Clásica")} />
                    </View>
                )}
                {Oro && (
                    <View style={styles.tarjetasContainer}>
                        <Text>Tarjeta de Crédito Oro.</Text>
                        <Tarjeta tipo='Oro' />
                        <Button title="Seleccionar" onPress={() => seleccionarProducto("Tarjeta de Crédito Oro")} />
                    </View>
                )}
                {Platinum && (
                    <View style={styles.tarjetasContainer}>
                        <Text>Tarjeta de Crédito Platinum.</Text>
                        <Tarjeta tipo='Platinum' />
                        <Button title="Seleccionar" onPress={() => seleccionarProducto("Tarjeta de Crédito Platinum")} />
                    </View>
                )}
                {Black && (
                    <View style={styles.tarjetasContainer}>
                        <Text>Tarjeta de Crédito Black.</Text>
                        <Tarjeta tipo='Black' />
                        <Button title="Seleccionar" onPress={() => seleccionarProducto("Tarjeta de Crédito Black.")} />
                    </View>
                )}
            </View>
        );
    };

    const ofertasFiltradass = ofertas.filter(oferta =>
        oferta.includes('Apertura de cuenta') || oferta.includes('Crédito personal hasta')
    );

    console.log('Ofertas Filtradas:', ofertasFiltradass);

//Examen 3
const [productosSeleccionados, setProductosSeleccionados] = useState([]);
const seleccionarProducto = (producto) => {
    if (!productosSeleccionados.includes(producto)) {
        setProductosSeleccionados((prev) => [...prev, producto]);
    }
};

const guardarProductosSeleccionados = async () => {
    try {
        await AsyncStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
        navigation.navigate('Compras'); 
    } catch (error) {
        console.error('Error guardando productos seleccionados:', error);
    }
};

//fin

const renderOferta = ({ item }) => {
    let icono = null;

    
    if (item.includes('Apertura de cuenta')) {
        icono = <Icon name="user" size={50} color="blue" />;
    } else if (item.includes('Crédito personal')) {
        icono = <Icon name="money" size={50} color="green" />;
    }

    return (
        <View style={styles.offerContainer}>
            {/* Muestra el ícono */}
            <Text style={styles.textlista}> {icono} {item}</Text>

                <TouchableOpacity onPress={() => seleccionarProducto(item)}>
                    <Text style={styles.textseleccionar}>Seleccionar</Text>
                </TouchableOpacity>
        </View>
    );
};

    return (
       
        <View style={styles.mainContainer}>
            <Text style={styles.title}>¡Aprovecha estas ofertas!</Text>
            <FlatList
                data={ofertasFiltradass}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderOferta}
                ListEmptyComponent={() => 
                    <View>
                <Text>No hay ofertas disponibles</Text>
                </View>}
                
            />
            <ScrollView style={styles.scrollContainer}><TarjetasCredito /></ScrollView>
             <Button title="Finalizar Selección" onPress={guardarProductosSeleccionados} />
        </View>
       

    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: 'column',
        padding: 10,
    },
    mainContainer: {
        width: '100%',
        padding: 20,
        marginTop:20,
        alignItems: 'center',
        flex: 1
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    offerContainer: {
        marginBottom: 10,
    },
    tarjetasContainer: {
        width: '100%',
        padding: 1,
        flex: 1,
        alignItems: 'center',
    },
    tarjeta: {
        alignItems: 'center',
        marginBottom: 5,
        padding: 5,
        borderRadius: 10,
    },
    textseleccionar:{
        padding: 5,
        borderRadius: 20,
        color: 'green',
        fontWeight: 'bold',
        textAlign:'center'

    },
    textlista:{
        padding: 5,
        fontWeight: 'bold',
        textAlign:'center',
        alignItems:'center'
    }
});
