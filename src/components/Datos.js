import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator,StyleSheet,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Url from './Url';
import Icon from 'react-native-vector-icons/FontAwesome/';


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
      //id notificaciones
      await AsyncStorage.setItem('idNotificacionPush', persona.idNotificacionPush);  
      console.log('Nombre de la persona guardado en AsyncStorage:', persona.nombreCompleto); 
      navigation.navigate('ProductosPersona'); 
    } catch (error) {
      console.log('Error al guardar nombre en AsyncStorage:', error);
    }
  };
  const eliminarPersona = async (id) => {
    Alert.alert(
      "Eliminar Persona",
      "¿Estás seguro de que deseas eliminar esta persona?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const url_delete = Url + `/eliminarpersona/${id}`;
              await axios.delete(url_delete);
              console.log('Persona eliminada correctamente');
              obtenerPersonas(); // Actualizar la lista de personas
            } catch (error) {
              console.log('Error al eliminar persona:', error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <ScrollView  style={styles.container}>

      <Text style={styles.title}>Personas Registradas <Icon name="user" size={24} color="black" /></Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> 
      ) : (
        personas.length > 0 ? (
          personas.map((persona) => (
            <View key={persona._id} style={styles.personaContainer}>
              <Text style={styles.Name}><Icon name="user" size={24} color="black" />Nombre:{persona.nombreCompleto} </Text>
              <Text style={styles.emptyText}><Icon name="phone" size={24} color="black" />Telefono:{persona.telefono}</Text>
              <Text style={styles.emptyText}><Icon name="home" size={24} color="black" />Dirección:{persona.direccion}</Text>
              {/*<Text style={styles.emptyText}>Id Notificaciones:{persona. idNotificacionPush}</Text>*/}
              
              
              <View style={styles.botonproductos}>
                <TouchableOpacity
                onPress={() => verProductos(persona)}
                 style={styles.verButton}>
                <Text style={styles.verButtonText}>Ver productos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => eliminarPersona(persona._id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>           
               </View>
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
    marginTop: 5,
    
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
deleteButton: {
  backgroundColor: '#ff0000',
  padding: 5,
  borderRadius: 5,
  marginTop: 5,
},
deleteButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
},
});
