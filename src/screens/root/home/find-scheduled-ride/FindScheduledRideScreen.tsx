import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import BackButton from '../../../../components/BackButton'
import Map from '../../../../components/Map'
import AntDesign from '@expo/vector-icons/AntDesign';
import StyledButton from '../../../../styled/StyledButton'
import colors from '../../../../utils/data/colors'
import AcceptSlider from '../../../../components/AcceptSlider'
import { FindRideScreenProps, FindScheduledRideScreenProps } from '../../../../types/types'
import { SocketContext } from '../../../../context/SocketContext'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, snapshotEqual, Timestamp, where } from 'firebase/firestore'
import { database } from '../../../../../firebaseConfig'
import FindRideBottomSheet from '../find-ride/FindRideBottomSheet'
import Entypo from '@expo/vector-icons/Entypo';
import { setScheduledRide } from '../../../../state/scheduledRide/scheduledRideSlice'
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
const { height, width } = Dimensions.get("screen")

const FindScheduledRideScreen = ({ navigation, route }: FindScheduledRideScreenProps) => {
    let [riders, setRiders] = useState<any[]>([]);
    const bottomsheetRef = useRef<any>(null);
    const socket = useContext(SocketContext)
    const { ongoingRide } = useSelector((state: RootState) => state.ongoingRide)
    const { offeredPrice, vehicleType, rideId, initialPrice } = useSelector((state: RootState) => state.rideRequest)
    const { user } = useSelector((state: RootState) => state.user)
    const { userLocation, destinationLocation } = useSelector((state: RootState) => state.location)
    const { scheduledRide } = useSelector((state: RootState) => {
        return state.scheduledRide
    })

    const { selectedTime, date, alertDate } = route.params


    const dispatch = useDispatch();
    console.log("alert date", alertDate.toString())
    useEffect(() => {

        const getRequests = async () => {
            try {
                if (user) {
                    //fetch any requests belonging to the user
                    const collectionRef = collection(database, "driverRideRequests");
                    const q = rideId ? (query(collectionRef,
                        where('userId', '==', user?.id!), where("rideId", "==", rideId),)) : (query(collectionRef,
                            where('userId', '==', user?.id!)))

                    const unsubscribe = onSnapshot(q, async (snapshot) => {
                        const newRiders: any = snapshot.docs.map(doc => ({
                            id: doc.id,
                            name: doc.data().driver.fullName,
                            offeredPrice: doc.data().driverOffer,
                            rating: 4.35,
                            noOfRides: 4,
                            timeInMinutes: 1,
                            ...doc.data()
                        }));

                        console.log("newriders", newRiders)

                        //add an scheduled ride and delete prev request.
                        dispatch(setScheduledRide(newRiders[0]));

                        //save ride in db
                        //add a ride to ride collection
                        await setDoc(doc(database, "rides", newRiders[0]?.rideId), {
                            rideId: newRiders[0]?.rideId,
                            ...newRiders[0],
                            createdAt: Timestamp.fromDate(new Date()),
                            status: "accepted"

                        })

                        //create chat room
                        await setDoc(doc(database, "chats", newRiders[0]?.rideId), {
                            rideId: newRiders[0]?.rideId,
                            createdAt: Timestamp.fromDate(new Date())

                        })


                        //set reminder
                        await notifee.requestPermission()

                        // Create a channel (required for Android)
                        const channelId = await notifee.createChannel({
                            id: 'default',
                            name: 'Default Channel',
                            vibration: true,
                            vibrationPattern: [300, 500],
                        });

                        console.log("alert date", alertDate)

                        const trigger: TimestampTrigger = {
                            type: TriggerType.TIMESTAMP,
                            timestamp: (new Date(alertDate)).getTime() // fire at 11:10am (10 minutes before meeting)
                        };
                        // Create a trigger notification
                        await notifee.createTriggerNotification(
                            {
                                title: 'Ride reminder',
                                body: `Today at ${selectedTime}`,

                                android: {
                                    channelId: channelId,
                                },
                                ios: {
                                    critical: true
                                }
                            },
                            trigger,
                        );

                        //delete req.
                        // first delete any existing old requests in driverRideRequests of that user so, we can fetch fresh requests for this particular ride.
                        const q = query(collection(database, "driverRideRequests"), where("userId", "==", user?.id));
                        const querySnapshot = await getDocs(q);

                        querySnapshot.forEach(async (doc) => {
                            await deleteDoc(doc.ref)
                        });

                        // also delete user ko old requests


                        const queryUser = query(collection(database, "userRideRequests"), where("userId", "==", user?.id));
                        const querySnapshotUser = await getDocs(queryUser);

                        querySnapshotUser.forEach(async (doc) => {
                            await deleteDoc(doc.ref)
                        });

                        navigation.navigate("HomeScreen");
                    });

                    // Cleanup subscription when component unmounts
                    return () => unsubscribe();
                }
            } catch (error: any) {
                console.log("scheduled ride error:", error?.message)
            }
        }
        getRequests();
    }, [user]);



    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <BackButton onPressHandler={() => {
                navigation.goBack()
            }} />
            <Map />
            <FindRideBottomSheet ref={bottomsheetRef}>
                <ScrollView contentContainerStyle={{}}>
                    {
                        (
                            <>

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomColor: "#ddd", borderBottomWidth: 1, paddingVertical: 15, paddingHorizontal: 16, marginTop: 10 }}>
                                    <View style={{ flexDirection: "row" }}>
                                        {
                                            vehicleType == "Bike" ? (<>
                                                <Image style={{ width: 50, height: 50 }} source={require("../../../../assets/images/electric.png")}></Image>
                                            </>) : (<>
                                                <Image style={{ width: 50, height: 50 }} source={require("../../../../assets/images/car.png")}></Image>
                                            </>)
                                        }
                                        <View style={{ flexDirection: "column", gap: 5, marginLeft: 10 }}>
                                            <Text style={{ textAlign: "center", color: "#333", fontSize: 14 }}>Looking for your</Text>
                                            <Text style={{ fontWeight: 500, color: colors.secondary[500], fontSize: 16 }}>{vehicleType} ride</Text>
                                        </View>
                                    </View>
                                    <ActivityIndicator color={colors.primary[500]}></ActivityIndicator>
                                </View>
                                {/* ride details */}
                                <View style={{ flexDirection: "column", marginTop: 20, paddingHorizontal: 16 }}>
                                    <View style={{ backgroundColor: colors.secondary[100], padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text>
                                        रू {initialPrice}
                                        </Text>
                                    </View>
                                    {/* pickup */}
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 20 }}>
                                        <View style={{ backgroundColor: colors.secondary[300], width: 30, height: 30, borderRadius: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                            <AntDesign name="arrowdown" size={20} color="#fff" />
                                        </View>
                                        <View style={{ flexDirection: "column", gap: 5, maxWidth: 300 }}>
                                            <Text numberOfLines={2} style={{}}>
                                                {userLocation?.userAddress}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* destination */}
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, gap: 10 }}>
                                        <View style={{ backgroundColor: colors.primary[400], width: 30, height: 30, borderRadius: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                            <Entypo name="location-pin" size={20} color="#fff" />
                                        </View>
                                        <View style={{ flexDirection: "column", gap: 5, maxWidth: 300 }}>
                                            <Text numberOfLines={2} style={{}}>
                                                {destinationLocation?.destinationAddress}
                                            </Text>
                                        </View>
                                    </View>

                                </View>

                                <View>

                                </View>
                                <View style={{ paddingHorizontal: 16 }}>
                                    <StyledButton

                                        buttonStyles={{ backgroundColor: "#eee", marginTop: 20, marginBottom: 20, }}
                                        textStyles={{ color: colors.secondary[600] }}
                                        title='Cancel request'
                                        onPress={() => { }}
                                    />
                                </View>
                            </>
                        )
                    }

                </ScrollView>
            </FindRideBottomSheet>


        </GestureHandlerRootView>
    )
}

export default FindScheduledRideScreen

const styles = StyleSheet.create({
    overlayContainer: {
        position: "absolute",
        height,
        width,
        top: 0,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.5)"
    }
})




