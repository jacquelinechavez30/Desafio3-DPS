import axios from 'axios';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity,  Alert, ActivityIndicator, Input, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome/';
import Url from './Url';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function Persona() {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const url_post_persona = Url + '/crearPersona';

    const [expoPushToken, setExpoPushToken] = useState(null);
    useEffect(() => {
        const fetchPushToken = async () => {
            const token = await AsyncStorage.getItem('expoPushToken');
            if (token) {
                const formattedToken = token.match(/\[(.*?)\]/);
                if (formattedToken) {
                    setExpoPushToken(formattedToken[1]); // Guarda solo lo que está dentro de los corchetes
                } else {
                    setExpoPushToken(token);
                }
            }
        };
        fetchPushToken();
    }, []);

    //validaciones
    const validationSchema = Yup.object().shape({
        nombreCompleto: Yup.string().required('El nombre de usuario es obligatorio.'),
        direccion: Yup.string().required('La dirección es obligatoria.'),
        telefono: Yup.string()
            .required('El teléfono es obligatorio.')
            .matches(/^[0-9]+$/, 'El teléfono solo puede contener números')
            .min(8, 'Debe ser un número de teléfono válido')
            .max(8, 'Debe ser un número de teléfono válido'),
    });

    const crearPersona = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post(url_post_persona, {
                nombreCompleto: values.nombreCompleto,
                direccion: values.direccion,
                telefono: values.telefono,
                fotoCarnet: 'photoCarnet',
                fotoSelfie: 'photoSelfie',
                idNotificacionPush: expoPushToken,
            });

            await AsyncStorage.setItem('nombreCompleto', values.nombreCompleto);
            console.log('Nombre completo guardado:', values.nombreCompleto);

            Alert.alert('¡Éxito!', 'Tu pedido se ha realizado exitosamente.');
            console.log('Persona creada:', response.data);
            console.log('expoPushToken:', expoPushToken);
            navigation.navigate('Compras');
        } catch (error) {
            console.error('Error al relizar compra:', error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    return (
        <>
        <View style={styles.contGeneral}>
            <Icon
            name="user-circle"
            size={70}
            color="#2196"
            marginBottom={15}
            marginTop={15}
            style={styles.icon}/>
                <Formik
                initialValues={{
                    nombreCompleto: '',
                    direccion: '',
                    telefono: '',
                    fotoCarnet: '',
                    fotoSelfie: '',
                    idNotificacionPush: expoPushToken,
                }}
                validationSchema={validationSchema}
                onSubmit={crearPersona}
                >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.inputContainer}>
                    <View>
                        <TextInput
                        placeholder='Nombre completo'
                        style={styles.textInput}
                        onChangeText={handleChange('nombreCompleto')}
                        onBlur={handleBlur('nombreCompleto')}
                        value={values.nombreCompleto}
                        >
                        </TextInput>
                        {touched.nombreCompleto && errors.nombreCompleto && <Text style={styles.errorText}>{errors.nombreCompleto}</Text>}

                        <TextInput
                        placeholder='Dirección'
                        style={styles.textInput}
                        onChangeText={handleChange('direccion')}
                        onBlur={handleBlur('direccion')}
                        value={values.direccion}
                        >
                        </TextInput>
                        {touched.direccion && errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}

                        <TextInput
                        placeholder='Teléfono'
                        style={styles.textInput}
                        onChangeText={handleChange('telefono')}
                        onBlur={handleBlur('telefono')}
                        value={values.telefono}
                        keyboardType='numeric'
                        >
                        </TextInput>
                        {touched.telefono && errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}

                        <Button title='Guardar datos personales' onPress={handleSubmit} disabled={loading}></Button>
                    </View>
                    </View>
                )}
            </Formik>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    contGeneral: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    icon: {
        marginBottom: 15,
        marginTop: 15,
        alignSelf: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -5,
        marginBottom: 15,
    },
});