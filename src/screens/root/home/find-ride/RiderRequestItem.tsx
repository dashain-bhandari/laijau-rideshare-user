import { StyleSheet, Text, View, Image, Easing, Dimensions, Pressable } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'

import Animated, { FadeIn, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Keyframe } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import colors from '../../../../utils/data/colors';
import { collection, deleteDoc, disableNetwork, doc, getDocs, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { database } from '../../../../../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigation } from '../../../../types/types';
import { setOngoingRide } from '../../../../state/ongoingRide/ongoingRideSlice';
import { setBookedForFriend } from '../../../../state/rideRequest/rideRequestSlice';
import { AxiosInstance } from '../../../../config/AxiosInstance';


const { height } = Dimensions.get("screen")

const RiderRequestItem = forwardRef(({ item, setRiders, riders }: any, ref) => {

    const dispatch = useDispatch();
    const navigation = useNavigation<HomeScreenNavigation>();
    const { user } = useSelector((state: RootState) => state.user)
    const enteringAnimation = new Keyframe({
        0: {
            transform: [{ translateY: height }],
        },

        100: {
            transform: [{ translateY: 0 }],
        },
    }).duration(400);

    const translateY = useSharedValue(height)



    // call the exiting animation after certain duration
    //after animation completes, i want item to be removed

    const removeItemAfterExitAnimation = (item: any) => {
        setRiders((prev: any) => {
            return (prev?.filter((i: any) => i.id !== item.id))
        })
    }

    const viewTranslateX = useSharedValue(0);

    const viewOpacity = useSharedValue(1)

    useEffect(() => {
        // translateY.value = withTiming(0, { duration: 500 });
        setTimeout(() => {
            viewTranslateX.value = withTiming(-400, { duration: 600 },

                () => {
                    runOnJS(removeItemAfterExitAnimation)(item)
                }
            )
            viewOpacity.value = withTiming(0, { duration: 600 })
        }, 60000);

    }, [])


    const exitingTranslateAnimation = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: viewTranslateX.value
            }],
            height: viewTranslateX?.value == (-400) ? 0 : "auto",

            marginBottom: viewTranslateX?.value == (-400) ? 0 : 10,
        }
    })
    const exitingOpacityAnimation = useAnimatedStyle(() => {
        return {
            opacity: viewOpacity.value
        }
    })

    //for accept ko button ko animation


    const translateX = useSharedValue(0);
    const animatedButtonColor = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: translateX.value
            }]
        }
    })

    useEffect(() => {
        translateX.value = withTiming(-174, { duration: 60000 })
    }, [])


    let decline = (item: any) => {
        setRiders((prev: any) => {
            console.log("prev", prev)
            const updatedRiders = prev.filter((i: any) => i.id !== item.id);
            console.log("Remaining riders after decline:", updatedRiders);
            return updatedRiders;
        });
    }

    const deleteDriverRequestFromDb = async () => {
        try {
            //delete driver ride requests collection belonging to that user
            if (user) {
                const q = query(collection(database, "driverRideRequests"), where("driverId", "==", item?.driverId));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref)
                });
            }

        } catch (error) {
            console.log("error", error)
        }
    }
    const onDecline = (item: any) => {
        console.log(`Declining item with ID: ${item.id}`);

        viewTranslateX.value = withTiming(-400, { duration: 600 }, () => {
            runOnJS(decline)(item)
            runOnJS(deleteDriverRequestFromDb)()

        });
        viewOpacity.value = withTiming(0, { duration: 600 });
    };


    const deleteRequestFromDb = async () => {
        try {

            // user ko request delete

            if (user) {
                const q = query(collection(database, "userRideRequests"), where("userId", "==", user?.id));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref)
                });
            }

            //delete driver ride requests collection belonging to that user
            if (user) {
                const q = query(collection(database, "driverRideRequests"), where("userId", "==", user?.id));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref)
                });
            }

        } catch (error) {
            console.log("error", error)
        }
    }

    const createAnOngoingRideAndChatRoom = async () => {
        try {

            //send data to backend

            console.log("item sent to backend", item)

            const { data } = await AxiosInstance.post("ride", {
                "pickup": item?.pickup,
                "dropoff": item?.dropoff,
                "bookedForFriend": item?.bookedForFriend,
                "scheduled": item?.scheduled,
                "scheduledDate": item?.scheduledDate,
                "userId": item?.userId,
                "driverId": item?.driverId,
                "fcmToken": item?.fcmToken,
                "distanceInKm": item?.distanceInKm ?? "0",
                "offeredPrice": item?.driverOffer,
                "vehicleType": item?.vehicleType,
                "rideId": item?.rideId
            });
            console.log("data: ", data.data)

            //add a ride to ride collection
            await setDoc(doc(database, "rides", item?.rideId), {
                rideId: item?.rideId,
                ...item,
                createdAt: Timestamp.fromDate(new Date()),
                status: "accepted"

            })

            //create chat room
            await setDoc(doc(database, "chats", item?.rideId), {
                rideId: item?.rideId,
                createdAt: Timestamp.fromDate(new Date())

            })
        } catch (error: any) {
            console.log("error", error.message)
        }

    }
    const onAccept = async (item: any) => {
        viewTranslateX.value = withTiming(-400, { duration: 600 }, () => {

            runOnJS(createAnOngoingRideAndChatRoom)()
            runOnJS(deleteRequestFromDb)()
            runOnJS(decline)(item)
        })
        viewOpacity.value = withTiming(0, { duration: 600 })
        if (item?.bookedForFriend) {
            dispatch(setBookedForFriend(item))
            navigation.navigate("AcceptedRideScreen", { tag: "bookedRide" });
        } else {
            dispatch(setOngoingRide(item));
            navigation.navigate("AcceptedRideScreen", { tag: "ongoingRide" });
        }

    }




    return (
        <Animated.View style={[
            exitingTranslateAnimation, exitingOpacityAnimation,
            { marginBottom: 10 }]}>
            <Animated.View
                entering={enteringAnimation}

                style={[styles.container,]}>

                {/* name,time,profile */}
                <View style={styles.infoContainer}>
                    {/* name,profile */}
                    <View style={styles.infoflexContainer}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: colors.primary[400] }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", borderRadius: 100 }}>
                                <Text style={{ color: "#fff", fontSize: 30 }}>{item?.driver?.fullName?.slice(0, 1)}</Text>
                            </View>
                        </View>
                        <View>
                            {/* name and no of rides */}
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ marginRight: 5 }} >{item?.name}</Text>
                                <View style={{ marginRight: 5 }}>
                                    <FontAwesome name="star" size={20} color={colors.secondary[400]} />
                                </View>
                                <Text style={{ marginRight: 5 }}>{item?.averageRating}</Text>
                                <Text style={{ color: "#555" }}>({item?.totalRides} rides)</Text>
                            </View>
                            {/* bike name */}
                            <Text>{item?.driver?.vehicleName ?? "Motor bike honda shine"}</Text>
                        </View>
                    </View>
                    {/* time */}
                    <View>

                        <Text style={{ fontWeight: 600 }}>{item?.riderDistance} km</Text>
                    </View>

                </View>
                {/* price */}
                <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontWeight: 600, fontSize: 26, color: "#444" }}>रु </Text>
                    <Text style={{ fontWeight: 700, fontSize: 30 }}>{item?.driverOffer ?? item.offeredPrice}</Text>
                </View>
                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <View style={{ width: "48%", marginRight: "4%", height: "100%" }}>
                        <TouchableOpacity
                            style={{ padding: 10, backgroundColor: "#eee", borderRadius: 10 }}
                            onPress={() => {
                                console.log("presed", item)
                                onDecline(item)
                            }}
                        >
                            <Text style={{ textAlign: "center" }}>Decline</Text>
                        </TouchableOpacity>
                    </View>
                    {/* accept container */}

                    <View style={styles.acceptContainer}>

                        <Animated.View pointerEvents='none' style={[styles.absoluteOverlayOnAcceptButton, animatedButtonColor]}></Animated.View>
                        <TouchableOpacity
                            onPress={() => {
                                onAccept(item);
                            }}
                            style={styles.acceptTouchable}>
                            <Text style={{ textAlign: "center", color: "#fff" }}>Accept</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Animated.View>
        </Animated.View>
    )
})

export default RiderRequestItem

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 16
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    infoflexContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        flex: 1,
        // backgroundColor:"red",


    },

    acceptContainer: { backgroundColor: colors.primary[800], width: "48%", borderRadius: 10, position: "relative", height: "100%", overflow: "hidden" },
    absoluteOverlayOnAcceptButton: { width: "100%", height: "100%", backgroundColor: colors.primary[500], position: "absolute", },
    acceptTouchable: {
        position: "absolute", zIndex: 1, padding: 10, width: "100%", borderRadius: 10, justifyContent: "center",
    }
})