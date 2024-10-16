import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator,StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Url from './Url';

export default Datos = ({ navigation }) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true); 
  const url_post = Url + '/personas';

  useEffect(() => {
    obtenerPersonas();
  }, []);

  const obtenerPersonas = async () => {
    try {
      const response = await axios.get(url_post);
      console.log('Personas registradas:', response.data);
      setPersonas(response.data);
    } catch (error) {
      console.log('Error al obtener personas:', error);
    } finally {
      setLoading(false); 
    }
  };


  const verProductos = async (persona) => {
    try {
      await AsyncStorage.setItem('nombrePersona', persona.nombreCompleto);  
      console.log('Nombre de la persona guardado en AsyncStorage:', persona.nombreCompleto); 
      navigation.navigate('ProductosPersona'); 
    } catch (error) {
      console.log('Error al guardar nombre en AsyncStorage:', error);
    }
  };

  return (
    <ScrollView  style={styles.container}>

      <Text style={styles.title}>Personas Registradas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> 
      ) : (
        personas.length > 0 ? (
          personas.map((persona) => (
            <View key={persona._id} style={styles.personaContainer}>
              <Text style={styles.Name}>Nombre:{persona.nombreCompleto}</Text>
              <Text style={styles.emptyText}>Telefono:{persona.telefono}</Text>
              <Text style={styles.emptyText}>Dirección:{persona.direccion}</Text>
              
              <View style={styles.botonproductos}>
                <TouchableOpacity
                                    onPress={() => verProductos(persona)}
                                    style={styles.verButton}
                                >
                                    <Text style={styles.verButtonText}>Ver productos</Text>
                                </TouchableOpacity></View>
            </View>
          ))
        ) : (
          <Text style={styles.productnohay}>No hay personas registradas</Text>
        )
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
      flexDirection: 'column',   
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginLeft: 20,
      textAlign:'center'
  },
  personaContainer: {
      flexDirection: 'column',
     //alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 10,
  },
  Name: {
      fontSize: 17,
  },
  productnohay: {
    fontSize: 18, 
    textAlign: 'center',
     marginTop: 20
  },
  botonproductos:{
    flexDirection: 'column',
    alignItems: 'center'
  },
  verButton: {
    backgroundColor: '#0000ff',
    padding: 5,
    borderRadius: 5,
    
},
verButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center'
},
emptyText: {
    color: 'gray',
    fontSize: 17,
},
});
