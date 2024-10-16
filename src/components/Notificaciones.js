import React, { useState, useEffect, useRef } from 'react';
import { Button, Platform, View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome/';

export default function Notificaciones() {
    const navigation = useNavigation();
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    }, []);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
    
async function schedulePushNotification() {

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "¡CreditMate! 📬",
            body: 'Estas apunto de registrarte.',
            
        },
        trigger: { seconds: 2 },
    });
    //navegar a Datos
    navigation.navigate('Datos');

}

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('¡No se pudieron obtener los permisos de notificaciones!');
            return;
        }

        
        const projectId = '2fadbc83-bd07-4b2b-bd6e-ebb1b6fdf48b'; 
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        await AsyncStorage.setItem('expoPushToken', token);
        console.log(token);
    } else {
        alert('Debes usar un dispositivo físico para recibir notificaciones push.');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido a CreditMate</Text>
            <Icon name="user-circle" size={75} color="#219999" 
                          marginLeft={20}/>
            <Text>Regístrate para continuar</Text>
            <Text>Tu token de Expo Push: {expoPushToken}</Text>
            <View style={styles.button}>
            <Button
                title="Iniciar Registro"

                onPress={async () => {
                    await schedulePushNotification();
                }}

            />
            </View>
            {/*notification && (
                <View style={{ marginTop: 20 }}>
                    <Text>Última notificación recibida:</Text>
                    <Text>{notification.request.content.title}</Text>
                    <Text>{notification.request.content.body}</Text>
                </View>
            )*/}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        marginTop: 20,
    },
    text: {
        fontSize: 20,
        //negrita
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },

 
});
