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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { database } from '../../../../firebaseConfig';
import { setOngoingRide } from '../../../state/ongoingRide/ongoingRideSlice';
import OngoingRide from '../../../components/OngoingRide';
import { setScheduledRide } from '../../../state/scheduledRide/scheduledRideSlice';
import ScheduledRide from '../../../components/ScheduledRide';
import { HomeScreenNavigation, TabsScreenProps } from '../../../types/types';

const ios = Platform.OS === "ios";
const Home = () => {
const navigation=useNavigation<HomeScreenNavigation>();
    const socket = useContext(SocketContext)
    const { user } = useSelector((state: RootState) => state.user);
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

    const dispatch = useDispatch();
    //fetch user ongoing ride if any
    const fetchOngoingRide = async () => {
        try {
            if (user) {

                const unsubscribe = onSnapshot(collection(database, "rides"), async (snapshot) => {
                    const newRequests = snapshot.docs.
                        filter(doc => {

                            return doc.data().userId == user?.id && !doc.data().scheduled
                        })
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                    if (newRequests && newRequests.length > 0) {
                        console.log("ongoing ride found:", newRequests)
                        dispatch(setOngoingRide(newRequests[0]))
                    }
                })

                // Cleanup subscription when component unmounts
                return () => unsubscribe();
            }
        } catch (error: any) {
            console.log("Error fetching user's ongoing ride", error.message)
        }
    }
    useEffect(() => {
        fetchOngoingRide();
        fetchScheduledRide();
    }, [user])

    const fetchScheduledRide = async () => {
        try {
            if (user) {

                const unsubscribe = onSnapshot(collection(database, "rides"), async (snapshot) => {
                    const newRequests = snapshot.docs.
                        filter(doc => {

                            return doc.data().userId == user?.id && doc.data().scheduled
                        })
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                    if (newRequests && newRequests.length > 0) {
                        console.log("ongoing ride found:", newRequests)
                        dispatch(setScheduledRide(newRequests[0]))
                    }
                })

                // Cleanup subscription when component unmounts
                return () => unsubscribe();
            }
        } catch (error: any) {
            console.log("Error fetching user's ongoing ride", error.message)
        }
    }

    return (

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SafeAreaView  >

                <View style={{ paddingHorizontal: 16 }}>
                    {/* header */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={{ fontWeight: "semibold", fontSize: 20 }}>Hi! {user?.fullName}</Text>
                            <Text>Welcome back</Text>
                        </View>
                        {/* image avatar */}
                        <Pressable
                        onPress={()=>navigation.navigate("UserProfileScreen")}
                            // onPress={() => navigation.push("/(root)/(screens)/user-profile")} 
                            style={styles.userAvatar}>
                            {/* <Image resizeMode='contain' style={{ width: 45, height: 45 }} source={require("../../../assets/images/user.jpg")}></Image> */}
                            <View style={{ backgroundColor: colors.primary[400], width: "100%", height: "100%", borderRadius: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "#fff", fontSize: 30 }}>{user?.fullName?.slice(0, 1)}</Text>
                            </View>
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


                    {/* book for a friend
                    <BookForFriend/> */}
                    {/* ongoing ride */}
                    <OngoingRide />
                    {/* scheduled ride */}
                    <ScheduledRide />
                </ScrollView>
            </SafeAreaView>
        </View>

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

    userAvatar: { width: 45, height: 45, borderRadius: 40, }
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