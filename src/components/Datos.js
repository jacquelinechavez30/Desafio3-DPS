import React,  { useState, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from "@react-navigation/native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome/';


export default function Datos()  {
    const navigation = useNavigation(); // Usar el hook de navegación

    const handleSubmit = (values) => {
        console.log('Formulario enviado:', values);
        Alert.alert('Compra finalizada', 'Gracias por su compra');
        onClose(); // Cerrar el modal o el componente
    };

    const validationSchema = Yup.object().shape({
        nombreProducto: Yup.string().required('El nombre del producto es obligatorio'),
        nombreCompleto: Yup.string().required('El nombre completo es obligatorio'),
        direccion: Yup.string().required('La dirección es obligatoria'),
        telefono: Yup.string()
            .required('El teléfono es obligatorio')
            .matches(/^[0-9]+$/, 'El teléfono solo puede contener números'),
    });

    //camara
    const [facing, setFacing] = useState('back');
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  //para guardar la foto 
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Necesita permiso para ver la camara</Text>
        <Button style={styles.buttonText} onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  function handleOpenCamera() {
    setIsCameraVisible(true);
  }

  function handleCloseCamera() {
    setIsCameraVisible(false);
    setPhoto(null);
  }
//Para tomar la foto
function takePicture() {

        const photo = takePictureAsync({ base64: true });
        setPhoto(photo.uri); 
        Alert.alert('Foto tomada', 'La foto ha sido tomada exitosamente') 
}


    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Finalizar Compra</Text>
            <View style={styles.containerC}>
      {isCameraVisible ? (
        <CameraView style={styles.cameraC} facing={facing}>
          <View style={styles.buttonContainerC}>
          <TouchableOpacity style={styles.buttonC} onPress={toggleCameraFacing}>
              <Text style={styles.text}><Icon name="rotate-left" size={24} color="#fff" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonC} onPress={takePicture}>
              <Text style={styles.text}><Icon name="camera-retro" size={24} color="#fff" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonC} onPress={handleCloseCamera}>
              <Text style={styles.textC}><Icon name="close" size={24} color="#fff" /></Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (


        <View>
             <Formik
                initialValues={{
                    nombreProducto: '',
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
                            placeholder="Nombre del producto"
                            onChangeText={handleChange('nombreProducto')}
                            onBlur={handleBlur('nombreProducto')}
                            value={values.nombreProducto}
                        />
                        {errors.nombreProducto && touched.nombreProducto && (
                            <Text style={styles.errorText}>{errors.nombreProducto}</Text>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Nombre completo"
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

                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={handleOpenCamera} 
                        >
                            <Text style={styles.buttonText}>Tomar Fotografía de Carnet</Text>
                        </TouchableOpacity>
                      
                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={handleOpenCamera} 
                        >
                            <Text style={styles.buttonText}>Tomar Fotografía Selfie</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                        
                    </>
                )}
            </Formik>
        </View> 
      )}
    </View>

        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
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
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
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
    });
    


