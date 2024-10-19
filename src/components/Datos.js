import axios from 'axios';
import React,  { useState, useRef, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';  
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome/';
import Url from './Url';


export default function Datos()  {
    const navigation = useNavigation(); 
    const [loading, setLoading] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState(null);
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

const url_post = Url + '/crearPersona';

    const validationSchema = Yup.object().shape({
        nombreCompleto: Yup.string().required('El nombre de usuario es obligatorio.')
        .matches(/^\S*$/, 'El nombre de usuario no puede contener espacios.'),
        direccion: Yup.string().required('La dirección es obligatoria.'),
        telefono: Yup.string()
            .required('El teléfono es obligatorio.')
            .matches(/^[0-9]+$/, 'El teléfono solo puede contener números'),
    });

  const [photoCarnet, setPhotoCartnet] = useState('carnet');
  const [photoSelfie, setPhotoSelfie] = useState('selfie');

  {/*if (!permission.granted) {
    return (
      Alert.alert(
        'Habilitar cámaras',
        'Para continuar debe habilitar su cámara, ¿Conceder permiso?',
        [
            {text: 'Cancelar', onPress: () => {
              <View style={styles.container}>
                <Text style={styles.heading}>Necesitas habilitar la cámara para continuar</Text>
                <Button style={styles.buttonText} onPress={requestPermission} title="Permiso para camara" />
              </View>
            }},
            {text: 'Aceptar', onPress: () => {
                requestPermission();
            }},
        ],
        {cancelable: false},
      ));
  }*/}

  async function handleSubmit(values) {
    setLoading(true);
    //conectando ala api 
    try {
      await AsyncStorage.setItem('nombreCompleto', values.nombreCompleto);
      await AsyncStorage.setItem('direccion', values.direccion);
      await AsyncStorage.setItem('telefono', values.telefono);
      console.log('Nombre completo guardado:', values);
      console.log("Valores a enviar:", {
        nombreCompleto: values.nombreCompleto,
        direccion: values.direccion,
        telefono: values.telefono,
        fotoCarnet: photoCarnet, 
        fotoSelfie: photoSelfie, 
        idNotificacionPush: expoPushToken,
    });
      const response = await axios.post(url_post, {
        nombreCompleto: values.nombreCompleto,
        direccion: values.direccion,
        telefono: values.telefono,
        fotoCarnet: photoCarnet, 
        fotoSelfie: photoSelfie, 
        idNotificacionPush: expoPushToken,

      });
      navigation.navigate('Camara');
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Problemas al realizar el registro intenta mas tarde';
  Alert.alert('¡ERROR!', errorMessage);
  console.error(error);
    }
    finally {
      setLoading(false); 
  }
};

    return (
        <View  style={styles.Container}>
            <View style={styles.containerC}>
      
                          <View ><Text style={styles.Title}><Icon name="user-circle" size={30} color="#2196" 
                          marginLeft={20}/> Ingresa tus datos
                          </Text>
             <Formik
                initialValues={{
                    nombreCompleto: '',
                    direccion: '',
                    telefono: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de usuario"
                            onChangeText={handleChange('nombreCompleto')}
                            onBlur={handleBlur('nombreCompleto')}
                            value={values.nombreCompleto}
                        />
                        {errors.nombreCompleto && touched.nombreCompleto && (
                            <Text style={styles.errorText}>{errors.nombreCompleto}</Text>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Dirección"
                            onChangeText={handleChange('direccion')}
                            onBlur={handleBlur('direccion')}
                            value={values.direccion}
                        />
                        {errors.direccion && touched.direccion && (
                            <Text style={styles.errorText}>{errors.direccion}</Text>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Teléfono"
                            onChangeText={handleChange('telefono')}
                            onBlur={handleBlur('telefono')}
                            value={values.telefono}
                        />
                        {errors.telefono && touched.telefono && (
                            <Text style={styles.errorText}>{errors.telefono}</Text>
                        )}

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                        
                    </>
                )}
            </Formik>
            </View>
               
               
        </View> 
        </View>
    );

  }
const styles = StyleSheet.create({
    Container: {
        flex: 1,
         padding: 20,
        justifyContent: 'center',
    },
    Title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },
    containerC: {
        flex: 1,
        justifyContent: 'center',
      },
      messageC: {
        textAlign: 'center',
        paddingBottom: 10,
      },
      cameraC: {
        flex: 1,
      },
      buttonContainerC: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
      },
        headingC: {
        fontSize: 24,
        marginBottom: 20,
      },
        buttonC: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
      },
        heading: {
        fontSize: 24,
        marginBottom: 20,
      },
      buttonTextC: {
        color: '#fff',
        fontSize: 18,
      },
      textC: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
      },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 16,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
});