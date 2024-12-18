import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking } from 'react-native'
import colors from '../../../../utils/data/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigation } from '../../../../types/types';
import { database } from '../../../../../firebaseConfig';
import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { setOngoingRide } from '../../../../state/ongoingRide/ongoingRideSlice';
const AcceptedRideContent = () => {

    const navigation = useNavigation<HomeScreenNavigation>();
    const onChatPress = () => {
        navigation.navigate("ChatScreen")
    }

    const onCallPress = () => {
        Linking.openURL(`tel:${ongoingRide?.driver?.vehicleRegistrationNumber}`)
    }

    const [loading, setLoading] = useState(false)
    const { ongoingRide } = useSelector((state: RootState) => state.ongoingRide)
    const dispatch = useDispatch()
    useEffect(() => {
        if (ongoingRide) {
            const docRef = doc(database, "rides", ongoingRide?.rideId);
            const unsubscribe = onSnapshot(docRef, (snapshot) => {
                console.log(snapshot.data())
                dispatch(setOngoingRide(snapshot.data()));
            })
            return unsubscribe
        }
    }, [])

    useEffect(() => {
        if (ongoingRide && ongoingRide?.status == "ended") {
            try {
                const docRef = doc(database, "rides", ongoingRide?.rideId);
                deleteDoc(docRef)
                navigation.navigate("HomeScreen")
            } catch (error: any) {
                console.log("Error deleting ongoing ride: ", error?.message)
            }
        }
    }, [ongoingRide])
    return (
        <ScrollView style={styles.container}>
            {
                loading ? (<>
                    <ActivityIndicator color={colors.primary[500]}></ActivityIndicator>
                </>) :
                    (<>
                        <View style={styles.headerContainer}>
                            <View style={styles.dot}></View>
                            {
                                ongoingRide?.riderStatus !== "arrived" && (<Text>Rider is on the way to pickup</Text>)
                            }
                            {
                                ongoingRide?.riderStatus == "arrived" && ongoingRide?.status == "accepted" && (<Text>Waiting for driver to start the ride</Text>)
                            }
                            {
                                ongoingRide?.status == "started" && (<Text>The ride has started</Text>)
                            }
                        </View>
                        {/* vehicle details */}
                        <View style={styles.vehicleDetailContainer}>
                            <View style={styles.vehicleColumnContainer}>
                                <Text style={{ fontWeight: 600, fontSize: 18 }}>
                                    {ongoingRide?.driver?.vehicleRegistrationNumber}
                                </Text>
                                <Text style={{ color: "#555", marginTop: 4 }}>
                                    {ongoingRide?.driver?.vehicleName}
                                </Text>
                            </View>
                        </View>
                        {/* rider details */}
                        <View style={styles.riderDetails}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: "" }} style={{ width: 60, height: 60 }} resizeMode='contain'></Image>
                            </View>
                            <View style={{ flexDirection: "column" }}>
                                <Text>
                                    {ongoingRide?.driver?.fullName}
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                    <View style={styles.ratingContainer}>
                                        <View style={{ marginRight: 5 }}>
                                            <FontAwesome name="star" size={18} color={colors.secondary[400]} />
                                        </View>
                                        <Text style={{ color: "#888" }}>4.57</Text>
                                    </View>
                                    <View style={styles.separationLine}>

                                    </View>
                                    <Text style={{ color: "#888" }}>
                                        254 trips
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* chat and call  */}
                        <View style={styles.contactContainer}>

                            <Pressable style={styles.chatContainer}
                                onPress={onChatPress}
                            >
                                <View style={{ marginRight: 10 }}>
                                    <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary[500]} />
                                </View>
                                <Text style={{ color: "#888" }}>Pickup notes for rider</Text>
                            </Pressable>
                            <Pressable style={styles.callContainer}
                                onPress={onCallPress}
                            >
                                <Ionicons name="call" size={24} color={colors.primary[500]} />
                            </Pressable>
                        </View>

                    </>)
            }

        </ScrollView>
    )
}

export default AcceptedRideContent

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 24,
        paddingHorizontal: 24
    },
    dot: {
        backgroundColor: colors.secondary[400],
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10
    },
    vehicleDetailContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.primary[100],
        paddingHorizontal: 16,
        marginTop: 20,
        paddingVertical: 10
    },
    vehicleColumnContainer: {
        flexDirection: "column",
    },
    riderDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 16
    },
    imageContainer: { width: 60, height: 60, overflow: "hidden", borderRadius: 30, marginRight: 10, backgroundColor: "#eee", },
    ratingContainer: { flexDirection: "row", alignItems: "center", marginRight: 10 },
    separationLine: { marginRight: 10, width: 2, height: 10, backgroundColor: "#ccc" },
    contactContainer: {
        marginTop: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    chatContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        flexGrow: 1,
        marginRight: 10,
        padding: 10,
        borderColor: "#eee",
        borderWidth: 1,
        shadowColor: "#ccc",
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        borderRadius: 10
    },
    callContainer: {
        backgroundColor: "#fff",
        borderColor: "#eee",
        borderWidth: 1,
        shadowColor: "#ccc",
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        borderRadius: 10,
        padding: 10,

    }
})