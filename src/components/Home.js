import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";


export default function Home() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Home</Text>
      <TouchableOpacity onPress={() => navigation.navigate('FormularioIngreso')}>
         <Text style={{color: '#dc3545', marginBottom: 8, }}>Ir a formularios</Text>
       </TouchableOpacity>
    </View>
  )
}