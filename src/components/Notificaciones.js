import React, { useState, useEffect, useRef } from 'react';
import { Button, Platform, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
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
    
    navigation.navigate('FormularioIngreso');
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
    <ImageBackground
    source={require("../img/business-city.jpg")}
    style={styles.background}>
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido a CreditMate</Text>
            <Icon name="university" size={75} color="#002d70"/>
            <Text style={{margin:15, textAlign:'center', fontSize:20, color:'white', fontWeight:'450'}}>
                Controla tus finanzas, toma decisiones inteligentes y alcanza tus metas financieras con facilidad</Text>
            {/*<Text>Tu token de Expo Push: {expoPushToken}</Text>*/}
            <TouchableOpacity style={styles.button} on onPress={
                async () => {
                    await schedulePushNotification();
            }}>
                <Text style={styles.buttonText}>Comenzar <Icon name='hand-pointer-o'/>
                </Text>
            </TouchableOpacity>
            {/*notification && (
                <View style={{ marginTop: 20 }}>
                    <Text>Última notificación recibida:</Text>
                    <Text>{notification.request.content.title}</Text>
                    <Text>{notification.request.content.body}</Text>
                </View>
            )*/}
        </View>
    </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    button: {
        marginTop: 2,
        paddingVertical: 8,
        paddingHorizontal: 50,
        backgroundColor: '#002d70',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 20,
        textAlign: 'center',
        color: '#fff',
    },
});