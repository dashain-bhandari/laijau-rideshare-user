import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, serverTimestamp, snapshotEqual, where } from 'firebase/firestore'
import { database } from '../../../../../firebaseConfig'
import { setOfferedPrice, setRideId } from '../../../../state/rideRequest/rideRequestSlice'
import { KNN } from '../../../../helpers/KNN'

const { height, width } = Dimensions.get("screen")

const FindRide = ({ navigation }: FindRideScreenProps) => {
    let [riders, setRiders] = useState<any[]>([]);
    const bottomsheetRef = useRef<any>(null);
    const socket = useContext(SocketContext)
    const { ongoingRide } = useSelector((state: RootState) => state.ongoingRide)
    const { offeredPrice, vehicleType, rideId,preferredVehicle,bookedForFriend,friendNumber,friendName,distanceInKm } = useSelector((state: RootState) => state.rideRequest)
    const { user } = useSelector((state: RootState) => state.user)
    const { userLocation, destinationLocation } = useSelector((state: RootState) => state.location)
    const { autoAccept } = useSelector((state: RootState) => state.rideRequest)


    const [newReqSent, setNewReqSent] = useState(false);


    const findNearestDrivers = async () => {
        try {
            const allDrivers: any = [];
            const q = query(collection(database, "driverLocations"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                allDrivers.push(doc.data());
            });
            console.log("all drivers", allDrivers)
            const nearestDrivers = KNN(allDrivers, { location: { lat1: userLocation?.userLatitude, lon1: userLocation?.userLongitude }, preference: preferredVehicle, vehicleType }, 15);
            console.log("nearest drivers are: ", nearestDrivers);
            return nearestDrivers;

        } catch (error: any) {
            console.log("error finding nearest drivers: ", error.message);
        }
    }

    //delete request function
    const deleteExpiredRequestsFromDb = async () => {

        const q = query(collection(database, "driverRideRequests"), where("userId", "==", user?.id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref)
        });

        const queryUser = query(collection(database, "userRideRequests"), where("userId", "==", user?.id));
        const querySnapshotUser = await getDocs(queryUser);

        querySnapshotUser.forEach(async (doc) => {
            await deleteDoc(doc.ref)
        });

    }

    useEffect(() => {

        if (user) {
            //fetch any requests belonging to the user
            const collectionRef = collection(database, "driverRideRequests");
            const q = rideId ? (query(collectionRef,
                where('userId', '==', user?.id!), where("rideId", "==", rideId),)) : (query(collectionRef,
                    where('userId', '==', user?.id!)))

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newRiders = snapshot.docs.map(doc => {
                    console.log("offeredPrice,")
                    return {
                        id: doc.id,
                        name: doc.data().driver.fullName,
                        offeredPrice: doc.data().driverOffer,
                      
                        ...doc.data()
                    }
                });

                console.log("newriders", newRiders)
                setRiders(newRiders);

                //check if any rider can be autoaccepted
                // if (autoAccept) {
                //     const rider = newRiders.find((i) => {
                //         return i.offeredPrice === offeredPrice
                //     });

                //     if (rider) {
                //         //delete requests 
                //         deleteExpiredRequestsFromDb();

                //         //create a new ongoing ride state

                //         // navigation.navigate("AcceptedRideScreen");
                //     }

                // }
            });

            // Cleanup subscription when component unmounts
            return () => unsubscribe();
        }
    }, [user, newReqSent, autoAccept]);



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

    const [price, setPrice] = useState<number>(offeredPrice!);

    const dispatch = useDispatch();

    const onRaiseFareHandler = async () => {

        //raise fare, delete previous ride, and create another
        dispatch(setOfferedPrice(price));
        // first delete any existing old requests in driverRideRequests of that user so, we can fetch fresh requests for this particular ride.
        const q = query(collection(database, "driverRideRequests"), where("userId", "==", user?.id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref)
        });

        // also delete user ko old requests

        let rideId = `ride${Date.now()}`;
        console.log("rideId", rideId)
        dispatch(setRideId(rideId));

        const queryUser = query(collection(database, "userRideRequests"), where("userId", "==", user?.id), where("rideId", "!=", rideId));
        const querySnapshotUser = await getDocs(queryUser);

        querySnapshotUser.forEach(async (doc) => {
            await deleteDoc(doc.ref)
        });
        const nearestDrivers=await findNearestDrivers();

        await addDoc(collection(database, "userRideRequests"), {
            rideId: rideId,
            userId: user?.id,
            vehicleType,
            offeredPrice: price,
            pickup: userLocation,
            dropoff: destinationLocation,
            status: 'pending',
            user,
            scheduled: false,
            createdAt: serverTimestamp(),
            nearestDrivers,
            bookedForFriend,
           friendName:friendName??"",
                    friendNumber:friendNumber??"",
                    distanceInKm

        })
        setNewReqSent(!newReqSent)
    }

    const onCancelRequest = async () => {
        try {
            const queryUser = query(collection(database, "userRideRequests"), where("userId", "==", user?.id), where("rideId", "==", rideId));
            const querySnapshotUser = await getDocs(queryUser);

            querySnapshotUser.forEach(async (doc) => {
                await deleteDoc(doc.ref)
            });
            navigation.popTo("TabsScreen");

        } catch (error: any) {
            console.log("error in canceling requests", error?.message)
        }
    }
    const [disabled, setDisabled] = useState<boolean>()

    useEffect(() => {
        if (price && offeredPrice && price != offeredPrice) {
            setDisabled(false);
        }
        else {
            setDisabled(true)
        }
    }, [price, offeredPrice])

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <RiderRequest drivers={riders} setRiders={setRiders} />
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
                                    <PriceEditContainer price={price} setPrice={setPrice} />

                                    <StyledButton
                                        disabled={disabled}
                                        buttonStyles={{ backgroundColor: disabled ? colors.secondary[200] : "#F87A53", marginTop: 20 }}
                                        textStyles={{
                                            color: "#fff"
                                        }}
                                        title='Raise fare'
                                        onPress={() => onRaiseFareHandler()} />
                                </Animated.View>

                                {/* aceept slider */}

                                <AcceptNearestDriver />
                                <StyledButton

                                    buttonStyles={{ backgroundColor: "#eee", marginTop: 20, marginBottom: 20 }}
                                    textStyles={{ color: colors.secondary[600] }}
                                    title='Cancel request'
                                    onPress={() => { onCancelRequest() }}
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


const PriceEditContainer = ({ price, setPrice }: {
    price: number | undefined,
    setPrice: Dispatch<SetStateAction<number>>
}) => {
    const { offeredPrice, initialPrice } = useSelector((state: RootState) => state.rideRequest)

    const [disabled, setDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (price && offeredPrice && price - 10 >= offeredPrice) {
            setDisabled(false);
        } else {
            setDisabled(true)
        }
    }, [price, offeredPrice])

    return (
        <View style={{ borderWidth: 1, borderColor: "#eee", flexDirection: "row", justifyContent: "space-between", borderRadius: 10, padding: 5, alignItems: "center", height: 60, backgroundColor: "#fff", marginTop: 20, shadowColor: "#ccc", shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, shadowOpacity: 0.5 }}>
            <TouchableOpacity
                onPress={() => {
                    if (price) {
                        if (offeredPrice) {
                            if (offeredPrice && price - 10 >= offeredPrice!) {
                                if (price - 20 <= offeredPrice) {
                                    setDisabled(true);

                                }
                                setPrice(price - 10);
                            }

                        }
                    } else {
                        offeredPrice && setPrice(offeredPrice + 10)
                    }
                }}
                disabled={disabled}
                style={{ backgroundColor: !disabled ? colors.secondary[100] : "#eee", borderRadius: 5, height: "100%", paddingHorizontal: 10, justifyContent: "center" }}>
                <Text style={{ fontSize: 20, color: colors.secondary[500] }}>-10</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginRight: 5, fontSize: 26, color: "#555" }}>रु</Text>
                <Text style={{ fontSize: 30, }}>{price ?? offeredPrice}</Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    if (price) {
                        setPrice(price + 10)
                    } else {
                        offeredPrice && setPrice(offeredPrice + 10)
                    }
                }}
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