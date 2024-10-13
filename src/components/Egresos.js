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

// Validaciones
const validationSchema = Yup.object().shape({
  tipoEgreso: Yup.string().required("Selecciona un tipo de egreso"),
  monto: Yup.number()
    .typeError("El monto debe ser un número")
    .required("Ingresa un monto ($)")
    .positive("El monto no puede ser negativo"),
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
              style={{ inputIOS: styles.RNPickerSelect, inputAndroid: styles.RNPickerSelect }}
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

            <View style={styles.Button}>
              <Button title="Agregar Egreso" onPress={handleSubmit} />
            </View>
          </View>
        )}
      </Formik>

      <View style={styles.separator} />

      {egresos.length > 0 ? (
        <View style={styles.lista}>
          <Text style={{ color: '#dc3545', marginBottom: 8, }}>Toca un egreso para editar</Text> 
          <Text style={{ fontWeight: 'bold' }}>Lista de los egresos:</Text>
          <FlatList
            data={egresos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => editarEgreso(index)}>
                <Text>➤ Tipo de Egreso: {item.tipoEgreso}</Text>
                <Text>Monto: ${item.monto}</Text>
              </TouchableOpacity>
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
                      style={{ inputIOS: styles.RNPickerSelect, inputAndroid: styles.RNPickerSelect }}
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

                    <View style={styles.buttonModal}>
                      <Button title="Guardar cambios" onPress={handleSubmit} />
                    </View>
                    <View style={styles.buttonModal}>
                      <Button
                        title="Eliminar Egreso"
                        color="#dc3545"
                        onPress={eliminarEgreso}
                      />
                    </View>
                    <View style={styles.buttonModal}>
                      <Button
                        title="Cancelar"
                        onPress={() => setModalVisible(false)}
                      />
                    </View>
                  </View>
                )}
              </Formik>
            )}
          </View>
        </View>
      </Modal>
      {/*boton para ir a graficas  solo si el array egresos es diferente de null*/}
      {egresos && egresos.length > 0 && (
        <TouchableOpacity onPress={() => navigation.navigate('Graficas')}>
          <Text style={{ color: '#212529', marginBottom: 8, fontWeight: 'bold' }}>Ver gráficas</Text>
        </TouchableOpacity>
        
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  Text: {
    fontSize: 16,
    marginBottom: 8,
  },
  TextInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  RNPickerSelect: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  Button: {
    marginVertical: 10,
  },
  lista: {
    marginTop: 20,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "100%",
    backgroundColor: "#CED0CE",
  },
  error: {
    fontSize: 12,
    color: "red",
  },
  buttonModal: {
    marginVertical: 5,
  },
});
