
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Camara() {

  const [facing, setFacing] = useState('front');
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  //para guardar la foto 
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null); // Usar useRef para la cámara

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
    const takePicture = async () => {
        if (cameraRef.current) { // Asegúrate de que cameraRef.current esté definido
          try {
            const { uri } = await cameraRef.current.takePictureAsync({ quality: 0.5 });
            setPhoto(uri); // Guardar la URI de la foto tomada
          } catch (error) {
            console.error('Error taking picture', error);
          }
        }
      };

  return (
    <View style={styles.containerC}>
      {isCameraVisible ? (
        <CameraView style={styles.cameraC} facing={facing}>
          <View style={styles.buttonContainerC}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonC} onPress={handleCloseCamera}>
              <Text style={styles.textC}>Close Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <Button style={styles.buttonTextC} title="Open Camera" onPress={handleOpenCamera} />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
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
