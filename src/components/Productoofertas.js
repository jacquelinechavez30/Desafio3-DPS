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
    const [tarjetasSeleccionadas, setTarjetasSeleccionadas] = useState([]);
    const [ofertasSeleccionadas, setOfertasSeleccionadas] = useState([]);

    //carga de datos ingresos y egresos
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
    
    const toggleSeleccionarTarjeta = (nombre) => {
        setTarjetasSeleccionadas(prevState => {
            if (prevState.includes(nombre)) {
                deseleccionarProducto(nombre);
                return prevState.filter(item => item !== nombre);
            } else {
                seleccionarProducto(nombre);
                return [...prevState, nombre];
            }
        });
    };

    const toggleSeleccionarOferta = (item) => {
        setOfertasSeleccionadas(prevState => {
            if (prevState.includes(item)) {
                deseleccionarProducto(item);
                return prevState.filter(oferta => oferta !== item);
            } else {
                seleccionarProducto(item);
                return [...prevState, item];
            }
        });
    };

    const TarjetasCredito = () => {
        return (
            <View>
                {Clasica && (
                    <View style={styles.tarjetasContainer}>
                        <Text style={{fontSize:15}}>Tarjeta de Crédito Clásica</Text>
                        <Tarjeta tipo="Clasica" />
                        <Button
                        title={tarjetasSeleccionadas.includes("Tarjeta de Crédito Clásica") ? "Seleccionado" : "Seleccionar"}
                        onPress={() => toggleSeleccionarTarjeta("Tarjeta de Crédito Clásica")}
                        color={tarjetasSeleccionadas.includes("Tarjeta de Crédito Clásica") ? "green" : "black"}
                        />
                    </View>
                )}
                {Oro && (
                    <View style={styles.tarjetasContainer}>
                        <Text style={{fontSize:15}}>Tarjeta de Crédito Oro</Text>
                        <Tarjeta tipo='Oro' />
                        <Button
                        title={tarjetasSeleccionadas.includes("Tarjeta de Crédito Oro") ? "Seleccionado" : "Seleccionar"}
                        onPress={() => toggleSeleccionarTarjeta("Tarjeta de Crédito Oro")}
                        color={tarjetasSeleccionadas.includes("Tarjeta de Crédito Oro") ? "green" : "black"}
                        />
                    </View>
                )}
                {Platinum && (
                    <View style={styles.tarjetasContainer}>
                        <Text style={{fontSize:15}}>Tarjeta de Crédito Platinum</Text>
                        <Tarjeta tipo='Platinum' />
                        <Button
                        title={tarjetasSeleccionadas.includes("Tarjeta de Crédito Platinum") ? "Seleccionado" : "Seleccionar"}
                        onPress={() => toggleSeleccionarTarjeta("Tarjeta de Crédito Platinum")}
                        color={tarjetasSeleccionadas.includes("Tarjeta de Crédito Platinum") ? "green" : "black"}
                        />
                    </View>
                )}
                {Black && (
                    <View style={styles.tarjetasContainer}>
                        <Text style={{fontSize:15}}>Tarjeta de Crédito Black</Text>
                        <Tarjeta tipo='Black' />
                        <Button
                        title={tarjetasSeleccionadas.includes("Tarjeta de Crédito Black") ? "Seleccionado" : "Seleccionar"}
                        onPress={() => toggleSeleccionarTarjeta("Tarjeta de Crédito Black")}
                        color={tarjetasSeleccionadas.includes("Tarjeta de Crédito Black") ? "green" : "black"}
                        />
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

const deseleccionarProducto = (producto) => {
    if (productosSeleccionados.includes(producto)) {
        setProductosSeleccionados((prev) => prev.filter((item) => item !== producto));
    }
};

const guardarProductosSeleccionados = async () => {
    try {
        await AsyncStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
        navigation.navigate('Datos'); 
    } catch (error) {
        console.error('Error guardando productos seleccionados:', error);
    }
};

//fin

const renderOferta = ({ item }) => {
    let icono = null;

    
    if (item.includes('Apertura de cuenta')) {
        icono = <Icon
        name="user"
        size={50}
        color="blue"/>;
    } else if (item.includes('Crédito personal')) {
        icono = <Icon name="money" size={50} color="green" />;
    }

    return (
        <View style={styles.offerContainer}>
            {/* Muestra el ícono */}
            <Text style={styles.textlista}>{item}</Text>
            <View style={{marginTop:2}}>{icono}</View>
            <Button
            title={ofertasSeleccionadas.includes(item) ? "Seleccionado" : "Seleccionar"}
            onPress={() => toggleSeleccionarOferta(item)}
            color={ofertasSeleccionadas.includes(item) ? "green" : "black"}
            />
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
            style={{width: '100%', height:'90%', borderWidth: 1, paddingBottom: 0, marginBottom: 0, borderRadius: 10, backgroundColor: 'gainsboro'}}
            ListEmptyComponent={() => 
                    <View>
                        <Text>No hay ofertas disponibles</Text>
                    </View>
                    }
            />
            {ofertas && ofertas.length > 2 ? (
                <>
                <Text style={{fontSize:18, marginTop:10, marginBottom:9, textAlign:'center'}}>
                Selecciona las tarjetas de crédito{'\n'}que te interesen:
                </Text>
                <ScrollView style={styles.scrollContainer}><TarjetasCredito /></ScrollView>
                </>
            ) : (
                null
            )}
            {productosSeleccionados.length > 0 ? (
                <TouchableOpacity style={styles.botonFinalizar} onPress={guardarProductosSeleccionados}>
                    <Text style={styles.textBotFinalizar}>Finalizar selección</Text>
                </TouchableOpacity>
            ) : (
                null
            )}
    </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        width: '200%',
        flexDirection: 'column',
        borderWidth: 1,
        padding: 5,
        margin: 5,
        borderRadius: 10,
        backgroundColor: 'gainsboro',
        height: '200%',
    },
    mainContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    offerContainer: {
        padding: -10,
        margin: 10,
        alignItems: 'center',
    },
    tarjetasContainer: {
        padding: 1,
        flex: 1,
        alignItems: 'center',
        marginBottom: 20,
    },
    /*tarjeta: {
        alignItems: 'center',
        marginBottom: 5,
        padding: 5,
        borderRadius: 10,
    },*/
    textseleccionar:{
        padding: 5,
        borderRadius: 20,
        color: 'green',
        fontWeight: 'bold',
        textAlign:'center'
    },
    textlista:{
        padding: 0,
        textAlign:'center',
        fontSize: 17,
        color: '#333',
    },
    botonFinalizar: {
        backgroundColor: '#002d70',
        alignItems: 'center',
        margin: 10,
        marginBottom: 0,
        fontSize: 15,
        borderRadius: 10,
        padding: 10,
    },
    textBotFinalizar: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
