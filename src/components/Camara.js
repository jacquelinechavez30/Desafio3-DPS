import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity} from 'react-native';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function App() {
  const cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [facing, setFacing] = useState('back');
  const navigation = useNavigation();

  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync(); // this will ask the user for permission to access the camera
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync() // this will ask the user for permission to access the media library that means media library is the place where the photos and videos are stored
      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })(); // the empty array means this will only run once when the component mounts this avoids infinite requesting of permissions to the user
  }, []);

  if(hasCameraPermission === undefined){
    return <Text>Requesting permissions...</Text>
  } else if(!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings</Text>
  }


  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const savePhotoToAsyncStorage = async (base64) => {
    try {
      await AsyncStorage.setItem('fotoCarnet', base64);
      Alert.alert('Foto de carnet guardada', 'Tu foto de carnet ha sido guardada en AsyncStorage');
    } catch (error) {
      console.log('Error guardando la foto de carnet en AsyncStorage:', error);
    }
  };

  const takePic = async () => {
    try {
      if (cameraRef.current) {
        const options = {
          quality: 0.3, 
          base64: true,
          exif: false,
        };

        const newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);

        if (newPhoto.base64) {
          await savePhotoToAsyncStorage(newPhoto.base64); 
        } else {
          throw new Error('Error al capturar la imagen. No se generó base64.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto: ' + error.message);
    }
  };

  if(photo) {
    let sharePic = () => {
      Sharing.shareAsync(photo.uri).then( () => {
        setPhoto(undefined);
      })
    };

    let savePhoto = () => {
        MediaLibrary.saveToLibraryAsync(photo.uri).then( () => {
          Alert.alert("Guardada exitosamente", "Tu foto ha sido guardada en tu galería");
          navigation.navigate('Camara2');
        });
    };

    return(
      <SafeAreaView style={styles.buttonContainer2}>
        <Image style={styles.preview} source = {{ uri: "data:image/jpg;base64,"+ photo.base64 }} />
        {hasMediaLibraryPermission ? <Icon style={styles.buttonTake} name="save" onPress={savePhoto}/> : undefined}
          <Icon name='trash' style={styles.buttonTake} onPress={() => setPhoto(undefined)}/>
      </SafeAreaView>
    );
  }

  return (
    <CameraView style={styles.container} facing={facing} ref={cameraRef}>
      <Text style={{color:'white', fontWeight:'bold'}}>Coloca tu carnet</Text>
      <View style={styles.buttonContainer}>
        <Icon style={styles.buttonTake} name="camera" onPress={takePic}>
          </Icon>
          <Icon style={styles.buttonTake} name="refresh" onPress={toggleCameraFacing}>
          </Icon>
      </View>
    </CameraView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonContainer :{
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  buttonContainer2 :{
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  preview: {
    alignSelf : 'stretch',
    flex:1,
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonTake: {
    borderRadius:50,
    padding: 10,
    margin: 0,
    color: 'black',
    fontSize: 40,
    backgroundColor: 'white',
  },
  buttonFlip: {
    borderRadius:50,
    padding: 10,
    margin: 0,
    color: 'black',
    fontSize: 40,
    backgroundColor: 'white',
  },
  buttonSave: {
    borderRadius:50,
    padding: 10,
    margin: 0,
    color: 'black',
    fontSize: 40,
  },
});
