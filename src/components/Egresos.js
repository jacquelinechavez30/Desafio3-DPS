import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as Yup from "yup";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome/';

// Validaciones
const validationSchema = Yup.object().shape({
  tipoEgreso: Yup.string().required("Selecciona un tipo de egreso"),
  monto: Yup.number()
    .typeError("El monto debe ser un número.")
    .required("Ingresa un monto ($).")
    .positive("El monto no puede ser negativo."),
});

export default function Egresos() {
  const navigation = useNavigation();
  const [egresos, setEgresos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Cargar datos desde AsyncStorage al montar el componente
  useEffect(() => {
    const cargarDatosStorage = async () => {
      try {
        const datosJSON = await AsyncStorage.getItem('egresos');
        if (datosJSON != null) {
          setEgresos(JSON.parse(datosJSON));
        }
      } catch (error) {
        console.log(error);
      }
    };
    cargarDatosStorage();
  }, []);

  // Función para guardar los datos en AsyncStorage
  const guardarDatosStorage = async (egresos) => {
    try {
      const datosJSON = JSON.stringify(egresos);
      await AsyncStorage.setItem('egresos', datosJSON);
      console.log('Datos guardados:', datosJSON);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para guardar un nuevo egreso
  const guardarEgreso = (values, { resetForm }) => {
    const nuevosEgresos = [...egresos, values];
    setEgresos(nuevosEgresos);
    guardarDatosStorage(nuevosEgresos);
    resetForm();
  };

  // Función para preparar la edición de un egreso
  const editarEgreso = (index) => {
    setEditingIndex(index);
    setModalVisible(true);
  };

  // Función para guardar los cambios en la edición
  const guardarEdicion = (values) => {
    const updatedEgresos = egresos.map((egreso, index) =>
      index === editingIndex ? values : egreso
    );
    setEgresos(updatedEgresos);
    guardarDatosStorage(updatedEgresos);
    setEditingIndex(null);
    setModalVisible(false);
  };

  // Función para eliminar un egreso
  const eliminarEgreso = () => {
    const updatedEgresos = egresos.filter((_, index) => index !== editingIndex);
    setEgresos(updatedEgresos);
    guardarDatosStorage(updatedEgresos);
    setEditingIndex(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.Container}>
      <Formik
        initialValues={{ tipoEgreso: "", monto: "" }}
        validationSchema={validationSchema}
        onSubmit={guardarEgreso}
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
            <Text style={styles.Text}>Tipo de Egreso:</Text>
            <RNPickerSelect
              onValueChange={(value) => setFieldValue("tipoEgreso", value)}
              items={[
                { label: "Alquiler/Hipoteca", value: "Alquiler/Hipoteca" },
                { label: "Canasta Básica", value: "Canasta Básica" },
                { label: "Financiamientos (Préstamos fuera de hipoteca)", value: "Financiamientos" },
                { label: "Trasporte", value: "Trasporte" },
                { label: "Servicios públicos", value: "Servicios públicos" },
                { label: "Salud y Seguro", value: "Salud y Seguro" },
                { label: "Egresos Varios", value: "Egresos Varios" },
              ]}
              style={pickerSelectStyles}
              value={values.tipoEgreso}
              placeholder={{
                label: "Selecciona un tipo de egreso",
                value: null,
              }}
            />
            {touched.tipoEgreso && errors.tipoEgreso && (
              <Text style={styles.error}>{errors.tipoEgreso}</Text>
            )}

            <Text style={styles.Text}>Monto:</Text>
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

            <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Agregar egreso</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <View style={styles.separator} />

      {egresos.length > 0 ? (
        <View style={styles.lista}>
          <Text style={{ color: '#198754', marginBottom: 8, }}>Toca un egreso para editar</Text> 
          <Text style={{ fontWeight: 'bold' }}>Lista de egresos:</Text>
          <FlatList
            data={egresos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.flatListItem}>
                <TouchableOpacity onPress={() => editarEgreso(index)}>
                  <Text style={styles.flatListItemText}>➤ Tipo de Egreso: {item.tipoEgreso}</Text>
                  <Text style={styles.flatListItemText}>Monto: ${item.monto}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : (
        <Text style={styles.Text}>No hay egresos disponibles.</Text>
      )}

      <View style={styles.separator} />

      {/* Modal para editar egresos */}
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
                initialValues={egresos[editingIndex]}
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
                    <Text style={styles.Text}>Editando egreso:</Text>
                    <RNPickerSelect
                      onValueChange={(value) =>
                        setFieldValue("tipoEgreso", value)
                      }
                      items={[
                        { label: "Alquiler/Hipoteca", value: "Alquiler/Hipoteca" },
                        { label: "Canasta Básica", value: "Canasta Básica" },
                        { label: "Financiamientos (Préstamos fuera de hipoteca)", value: "Financiamientos" },
                        { label: "Trasporte", value: "Trasporte" },
                        { label: "Servicios públicos", value: "Servicios públicos" },
                        { label: "Salud y Seguro", value: "Salud y Seguro" },
                        { label: "Egresos Varios", value: "Egresos Varios" },
                      ]}
                      value={values.tipoEgreso}
                      placeholder={{
                        label: "Selecciona un tipo de egreso",
                        value: null,
                      }}
                      style={pickerSelectStyles}
                    />
                    {touched.tipoEgreso && errors.tipoEgreso && (
                      <Text style={styles.error}>{errors.tipoEgreso}</Text>
                    )}

                    <Text style={styles.Text}>Monto:</Text>
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
            onPress={eliminarEgreso}>
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
      {/*boton para ir a graficas  solo si el array egresos es diferente de null*/}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop:-1}}>
      <TouchableOpacity style={styles.botonMenu} onPress={() => navigation.navigate('FormularioIngreso')}>
          <Text style={{ color: 'white', fontWeight: 'bold',}}>
            <Icon name='arrow-left'></Icon> Volver a ingresos</Text>
      </TouchableOpacity>
      {egresos && egresos.length > 0 && (
        <TouchableOpacity style={styles.botonMenu} onPress={() => navigation.navigate('Graficas')}>
          <Text style={{ color: 'white', fontWeight: 'bold', }}>
            Ver gráficas <Icon name='arrow-right'></Icon></Text>
        </TouchableOpacity>
        
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  Text: {
    margin: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  Button: {
    backgroundColor: '#002d70',
    paddingVertical: 8,
    marginHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  botonMenu: {
    backgroundColor: '#002d70',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    paddingBottom: 6,
    paddingTop: 5,
    paddingHorizontal: 20,
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
  error: {
    color: 'red',
    marginTop: 0,
    marginLeft: 10,
    marginBottom: 5,
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