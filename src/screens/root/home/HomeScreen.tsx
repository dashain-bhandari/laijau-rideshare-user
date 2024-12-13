import { Linking, Modal, Platform, StyleSheet, Text, View, Image, AppState, Pressable } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import useLocation from '../../../hooks/useLocation';

import colors from '../../../utils/data/colors';
import { useNavigation } from '@react-navigation/native';
import Services from './Services';
import DestinationTextInput from './find-destination/DestinationTextInput';
import DestinationInput from './DestinationInput';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../../context/SocketContext';

const ios = Platform.OS === "ios";
const Home = () => {
    const navigation = useNavigation<any>()
    const socket = useContext(SocketContext)

    //for requesting permission and opening modal if permission denied
    const { modalOpen, setModalOpen, requestLocation, subscription, locationAccessPrompt } = useLocation()

    const closeModal = () => {
        setModalOpen(false)
    }

    useEffect(() => {
        console.log("loc requetsed")
        socket?.emit("message", { id: 1 })
        requestLocation()
    }, [])


    useEffect(() => {
        socket?.on("message", () => {
            console.log("socket msg recieved ");
        });
        return () => {
            socket?.off("message");
        }
    }, [socket])

    useEffect(() => {
        return () => {
            subscription.remove();

        };
    }, []);


    return (

        <SafeAreaView  >

            <View style={{ paddingHorizontal: 16 }}>
                {/* header */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <Text style={{ fontWeight: "semibold", fontSize: 20 }}>Hi! There</Text>
                        <Text>Welcome back</Text>
                    </View>
                    {/* image avatar */}
                    <Pressable onPress={() => navigation.push("/(root)/(screens)/user-profile")} style={styles.userAvatar}>
                        <Image resizeMode='contain' style={{ width: 45, height: 45 }} source={require("../../../assets/images/user.jpg")}></Image>
                    </Pressable >
                </View>
                {/* box  */}


            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                <View style={styles.centeredView}>
                    <Modal animationType="slide"
                        transparent={true} visible={modalOpen}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={{ alignSelf: "flex-start" }}>Please..</Text>
                                <View style={{ width: 200, height: 200, flexDirection: "row", justifyContent: "center" }}>
                                    <Image resizeMode="contain" source={require("../../../assets/images/locationaccess.png")} style={{ width: 200, height: 200 }}></Image>
                                </View>

                                <View>
                                    <Text >Puryau needs your location acesss to function properly.</Text>
                                </View>
                                <View style={{ alignSelf: "flex-end", flexDirection: "row", columnGap: 20 }}>
                                    <TouchableOpacity onPress={locationAccessPrompt}><Text style={{ color: colors.primary[600] }}>Settings</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={closeModal}><Text style={{ color: colors.secondary[600] }}>Exit</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={{ marginTop: 20 }}>
                    <DestinationInput />
                </View>
                {/* services  */}
                <View style={{ marginTop: 20 }}>
                    <Services />
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default Home

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: "rgba(0,0,0,0.5)"
    },

    userAvatar: { width: 45, height: 45, borderRadius: 40, overflow: "hidden" }
    ,
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})