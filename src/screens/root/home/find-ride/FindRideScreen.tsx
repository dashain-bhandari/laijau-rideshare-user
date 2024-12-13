import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import RiderRequest from './RiderRequest'
import BackButton from '../../../../components/BackButton'
import Map from '../../../../components/Map'
import FindRideBottomSheet from './FindRideBottomSheet'
import StyledButton from '../../../../styled/StyledButton'
import colors from '../../../../utils/data/colors'
import AcceptSlider from '../../../../components/AcceptSlider'
import { FindRideScreenProps } from '../../../../types/types'
import { SocketContext } from '../../../../context/SocketContext'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { collection, onSnapshot, query, snapshotEqual, where } from 'firebase/firestore'
import { database } from '../../../../../firebaseConfig'

const { height, width } = Dimensions.get("screen")

const FindRide = ({ navigation }: FindRideScreenProps) => {
    let [riders, setRiders] = useState<any[]>([]);
    const bottomsheetRef = useRef<any>(null);
    const socket = useContext(SocketContext)
    const { ongoingRide } = useSelector((state: RootState) => state.ongoingRide)
    const { offeredPrice, vehicleType } = useSelector((state: RootState) => state.rideRequest)
    const { user } = useSelector((state: RootState) => state.user)
    const { userLocation, destinationLocation } = useSelector((state: RootState) => state.location)

    useEffect(() => {
        socket?.on("new-driver-request", (data) => {
            Alert.alert("new request from driver recieved")
        })
        return () => {
            socket?.off("new-driver-request")
        }
    }, [socket])

    const addRiders = () => {

        const newItem = {

            id: Date.now(), // Unique ID for each rider
            name: `Rider ${riders.length + 1}`,
            rating: 4.35,
            noOfRides: 432,
            timeInMinutes: 4,
            offeredPrice: Math.floor(Math.random() * 100),
            avatar: require("../../../../assets/images/car.png"),
            active: true,
        };

        socket?.emit("new-user-request", {
            id: 1
        })
        console.log('Adding rider:', newItem.offeredPrice);

        // Add rider to the list
        // setRiders((prev) => prev?.length > 0 ? [...prev, newItem] : [newItem]);

        // Set timeout to remove the specific rider 
        // setTimeout(() => {
        //   setRiders((prev) => {
        //     // const newRiders = prev.map((rider) => rider.id == newItem.id ? { ...rider, active: false } : rider);

        //     console.log('updating rider with ID:', newItem.offeredPrice);
        //     return prev.filter((item: any) => item?.id != newItem?.id)
        //   });
        // }, 22000);
    };


    const sendRequest = () => {
        if (!ongoingRide || ongoingRide.status == "canceled") {
            socket?.emit("new-user-request", {
                userId: user?.id,
                vehicleType,
                offeredPrice,
                pickup: userLocation,
                dropoff: destinationLocation
            })
        }
    };
    useEffect(() => {
   if(user){
    const collectionRef = collection(database, "driverRideRequests");
    const q = query(collectionRef, 
    where('userId', '==', user?.id!));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const newRiders = snapshot.docs.map(doc => ({
            id: doc.id,
            name:doc.data().driver.fullName,
            offeredPrice:doc.data().driverOffer,
            avatar: require("../../../../assets/images/car.png"),
            rating: 4.35,
            noOfRides: 432,
            timeInMinutes: 4,
        }));
        
        console.log("newriders",newRiders)
        setRiders(newRiders);
    });

    // Cleanup subscription when component unmounts
    return () => unsubscribe();
   }
    }, []);



    const height = useSharedValue(176);
    const opacity = useSharedValue(1);

    const animatedViewStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
            opacity: opacity.value
        }
    })

    useEffect(() => {
        // if (riders?.some(rider => rider.active))
        if (riders?.length > 0) {
            height.value = withTiming(0, { duration: 400 });
            opacity.value = withTiming(0, { duration: 400 })
            bottomsheetRef.current?.setTranslateY(5);

            overlayOpacity.value = withTiming(1, { duration: 400 })
        }
        else {

            height.value = withTiming(176, { duration: 400 });
            opacity.value = withTiming(1, { duration: 400 })
            bottomsheetRef.current?.setTranslateY(2.6);

            overlayOpacity.value = withTiming(0, { duration: 400 })
        }
    }, [riders])



    const overlayOpacity = useSharedValue(0)
    const animatedOverlayStyles = useAnimatedStyle(() => {
        return {
            opacity: overlayOpacity.value
        }
    })

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <RiderRequest drivers={riders} setRiders={setRiders} />
            <BackButton onPressHandler={() => {
                navigation.goBack()
            }} />
            <Map />
            <FindRideBottomSheet ref={bottomsheetRef}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {
                        (
                            <>
                                <Animated.View style={[animatedViewStyle, { backgroundColor: "" }]}>
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={{ textAlign: "center", }}>Finding drivers...</Text>
                                    </View>
                                    {/* price edit container */}
                                    <PriceEditContainer />

                                    <StyledButton
                                        buttonStyles={{ backgroundColor: true ? colors.secondary[200] : "#F87A53", marginTop: 20 }}
                                        textStyles={{
                                            color: "#fff"
                                        }}
                                        title='Raise fare'
                                        onPress={() => { }} />
                                </Animated.View>

                                {/* aceept slider */}

                                <AcceptNearestDriver />
                                <StyledButton

                                    buttonStyles={{ backgroundColor: "#eee", marginTop: 20, marginBottom: 20 }}
                                    textStyles={{ color: colors.secondary[600] }}
                                    title='Cancel request'
                                    onPress={() => { }}
                                />
                            </>
                        )
                    }

                </ScrollView>
            </FindRideBottomSheet>

            <Animated.View style={[styles.overlayContainer, animatedOverlayStyles]}>
            </Animated.View>
        </GestureHandlerRootView>
    )
}

export default FindRide

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


const PriceEditContainer = () => {





    return (
        <View style={{ borderWidth: 1, borderColor: "#eee", flexDirection: "row", justifyContent: "space-between", borderRadius: 10, padding: 5, alignItems: "center", height: 60, backgroundColor: "#fff", marginTop: 20, shadowColor: "#ccc", shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, shadowOpacity: 0.5 }}>
            <TouchableOpacity

                style={{ backgroundColor: colors.secondary[100], borderRadius: 5, height: "100%", paddingHorizontal: 10, justifyContent: "center" }}>
                <Text style={{ fontSize: 20, color: colors.secondary[500] }}>-10</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginRight: 5, fontSize: 26, color: "#555" }}>रु</Text>
                <Text style={{ fontSize: 30, }}>{ }</Text>
            </View>
            <TouchableOpacity

                style={{ backgroundColor: colors.primary[200], borderRadius: 5, height: "100%", paddingHorizontal: 10, justifyContent: "center" }}>
                <Text style={{ fontSize: 20, color: colors.primary[700] }}>+10</Text>
            </TouchableOpacity>
        </View>
    )
}

const AcceptNearestDriver = () => {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <View style={{ width: "80%", }}>
                <Text >Automatically accept the nearest driver for your fare</Text>
            </View>
            <View style={{ width: 60 }}>
                <AcceptSlider />
            </View>
        </View>
    )
}