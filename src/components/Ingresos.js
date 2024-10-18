import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions
} from "react-native";
import * as Yup from "yup";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome/"


// Validaciones
const validationSchema = Yup.object().shape({
  tipoIngreso: Yup.string().required("Selecciona un tipo de ingreso"),
  monto: Yup.number()
    .typeError("El monto debe ser un número")
    .required("Ingresa un monto ($)")
    .positive("El monto no puede ser negativo"),
});

export default function Ingresos() {
  const navigation = useNavigation();
  //const { width } = useWindowDimensions();

  const [ingresos, setIngresos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Función para cargar los ingresos desde AsyncStorage
  const cargarDatosStorage = async () => {
    try {
      const datosJSON = await AsyncStorage.getItem('ingresos');
      if (datosJSON) {
        setIngresos(JSON.parse(datosJSON));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cargarDatosStorage();
  }, []);

  // Función para guardar los datos en AsyncStorage
  const guardarDatosStorage = async (dato) => {
    try {
      const datosJSON = JSON.stringify(dato);
      await AsyncStorage.setItem('ingresos', datosJSON);
      console.log('Datos guardados: ' + datosJSON);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para guardar un nuevo ingreso
  const guardarIngreso = (values, { resetForm }) => {
    console.log("Nuevo ingreso:", values);
    const nuevosIngresos = [...ingresos, values];
    setIngresos(nuevosIngresos);
    guardarDatosStorage(nuevosIngresos);
    resetForm();
  };

  // Función para preparar la edición de un ingreso
  const editarIngreso = (index) => {
    setEditingIndex(index);
    setModalVisible(true);
  };

  // Función para guardar los cambios en la edición
  const guardarEdicion = (values) => {
    const updatedIngresos = ingresos.map((ingreso, index) =>
      index === editingIndex ? values : ingreso
    );
    setIngresos(updatedIngresos);
    guardarDatosStorage(updatedIngresos);
    setEditingIndex(null);
    setModalVisible(false);
  };

  // Función para eliminar un ingreso
  const eliminarIngreso = () => {
    const updatedIngresos = ingresos.filter(
      (_, index) => index !== editingIndex
    );
    setIngresos(updatedIngresos);
    guardarDatosStorage(updatedIngresos);
    setEditingIndex(null);
    setModalVisible(false);
  };

 // console.log('Width:', width);

  return (
    <View style={styles.Container}>
      {/* Formulario para agregar ingresos */}
      <Formik
        initialValues={{ tipoIngreso: "", monto: "" }}
        validationSchema={validationSchema}
        onSubmit={guardarIngreso}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            <Text style={styles.Text}>Tipo de Ingreso:</Text>
            <RNPickerSelect
              onValueChange={(value) => setFieldValue("tipoIngreso", value)}
              items={[
                { label: "Salario", value: "Salario" },
                { label: "Negocio Propio", value: "Negocio Propio" },
                { label: "Pensiones", value: "Pensiones" },
                { label: "Remesas", value: "Remesas" },
                { label: "Ingresos Varios", value: "Ingresos Varios" },
              ]}
              style={pickerSelectStyles}
              value={values.tipoIngreso}
              placeholder={{
                label: "Selecciona un tipo de ingreso",
                value: null,
              }}
            />
            {touched.tipoIngreso && errors.tipoIngreso && (
              <Text style={styles.error}>{errors.tipoIngreso}</Text>
            )}

            <Text style={styles.Text}>Monto:</Text>
            <TextInput
              onChangeText={handleChange("monto")}
              style={styles.TextInput}
              value={values.monto}
              keyboardType="numeric"
              placeholder="Ingresa el monto"
            />
            {touched.monto && errors.monto && <Text style={styles.error}>{errors.monto}</Text>}

            <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Agregar ingreso</Text>
            </TouchableOpacity>
              {/*<View style={styles.Button}>
              <Button title="Agregar Ingreso" onPress={handleSubmit} />
              </View>*/}
          </View>
        )}
      </Formik>

      <View style={styles.separator} />

      {/* Listado de ingresos */}
      {ingresos.length > 0 ? (
        <View style={styles.lista}>
          <Text style={{ color: '#198754', marginBottom: 8, }}>Toca un ingreso para editar</Text>
          <Text style={{ fontWeight: 'bold' }}>Lista de ingresos:</Text>
          <FlatList
            data={ingresos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.flatListItem}>
                <TouchableOpacity onPress={() => editarIngreso(index)}>
                <Text style={styles.flatListItemText}>➤ Tipo de Ingreso: {item.tipoIngreso}</Text>
                <Text style={styles.flatListItemText}>Monto: ${item.monto}</Text>
              </TouchableOpacity>
              </View> 
              
            )}
          />
        </View>
      ) : (
        <Text style={styles.Text}>No hay ingresos disponibles.</Text>
      )}

      <View style={styles.separator} />

      {/* Modal para editar ingresos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            {editingIndex !== null && (
              <Formik
                initialValues={ingresos[editingIndex]}
                validationSchema={validationSchema}
                onSubmit={guardarEdicion}
              >
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <View>
                    <Text style={styles.Text}>Editando ingreso:</Text>
                    <RNPickerSelect
                      onValueChange={(value) =>
                        setFieldValue("tipoIngreso", value)
                      }
                      items={[
                        { label: "Salario", value: "Salario" },
                        { label: "Negocio Propio", value: "Negocio Propio" },
                        { label: "Pensiones", value: "Pensiones" },
                        { label: "Remesas", value: "Remesas" },
                        { label: "Ingresos Varios", value: "Ingresos Varios" },
                      ]}
                      value={values.tipoIngreso}
                      placeholder={{
                        label: "Selecciona un tipo de ingreso",
                        value: null,
                      }}
                    />
                    {touched.tipoIngreso && errors.tipoIngreso && (
                      <Text style={styles.error}>{errors.tipoIngreso}</Text>
                    )}

                    <Text style={styles.Text}>Nuevo monto:</Text>
                    <TextInput
                      onChangeText={handleChange("monto")}
                      style={styles.TextInput}
                      value={values.monto}
                      keyboardType="numeric"
                      placeholder="Ingresa el monto"
                    />
                    {touched.monto && errors.monto && (
                      <Text style={styles.error}>{errors.monto}</Text>
                    )}

                    <TouchableOpacity
                    style={{backgroundColor:'green', alignContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5, marginTop: 10}}
                    onPress={handleSubmit}>
                      <Text style={{color:'white'}}>GUARDAR CAMBIOS</Text>
                    </TouchableOpacity>

                  </View>
                )}
              </Formik>
            )}
            
            <TouchableOpacity
            style={{backgroundColor:'#dc3545', alignContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5, marginTop: 10}}
            onPress={eliminarIngreso}>
              <Text style={{color:'white'}}>ELIMINAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={{backgroundColor:'gray', alignContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5, marginTop: 10}}
            onPress={() => setModalVisible(false)}>
              <Text style={{color:'white'}}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/*boton para ir a Egresos  solo si el array Ingresos es diferente de null*/}
      {ingresos && ingresos.length > 0 && (
        <TouchableOpacity style={styles.botonMenu} onPress={() => navigation.navigate('FormularioEgresos')}>
          <Text style={{ color: 'white', marginBottom: 8, fontWeight: 'bold', textAlign:'right' }}>
            Ir a egresos <Icon name='arrow-right'></Icon></Text>
        </TouchableOpacity>
      )}


    </View>
  );
}

  // Estilos
  const styles = StyleSheet.create({
    Text: {
      margin: 10,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    Container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    Button: {
      backgroundColor: '#002d70',
      paddingVertical: 8,
      marginHorizontal: 30,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
      borderWidth: 1,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    botonMenu: {
      backgroundColor: '#002d70',
      alignItems: 'center',
      marginHorizontal: 5,
      marginTop: 0,
      borderRadius: 10,
      borderWidth: 1,
      paddingBottom: 0,
      paddingTop: 5,
      paddingHorizontal: 10,
    },
    error: {
      color: 'red',
      marginTop: 0,
      marginLeft: 10,
      marginBottom: 5,
    },
    TextInput: {
      marginTop: 0,
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 10,
      padding: 10,
      borderWidth: 0.5,
      backgroundColor: '#fff',
    },
    flatListItem: {
      padding: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    flatListItemText: {
      fontSize: 14,
      color: '#333',
    },
    separator: {
      height: 1,
      backgroundColor: '#ccc',
      marginVertical: 20,
      marginHorizontal: -10,
    },
    lista: {
      marginLeft: 30,
      marginRight: 10,
      marginBottom: 0,
      marginTop: 0,
    },
  });

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 10,
      backgroundColor: '#fff',
      fontSize: 16,
    },
    inputAndroid: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 10,
      backgroundColor: '#fff',
      fontSize: 16,
    },
  });