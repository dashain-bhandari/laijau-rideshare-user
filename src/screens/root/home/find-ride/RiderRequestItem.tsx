import { StyleSheet, Text, View, Image, Easing, Dimensions, Pressable } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'

import Animated, { FadeIn, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Keyframe } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import colors from '../../../../utils/data/colors';
import { collection, deleteDoc, doc, query, where } from 'firebase/firestore';
import { database } from '../../../../../firebaseConfig';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';


const { height } = Dimensions.get("screen")

const RiderRequestItem = forwardRef(({ item, setRiders, riders }: any, ref) => {


    const { requestRef } = useSelector((state: RootState) => state.rideRequest)
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

    // const onDecline = (item: any) => {
    //     viewTranslateX.value = withTiming(-400, { duration: 600 },()=>{
    //         runOnJS(setRiders)((prev:any)=>{
    //             return prev.filter((i:any)=>i.id!=item?.id)
    //         })
    //     })
    //     viewOpacity.value = withTiming(0, { duration: 600 })
    //     // to remove item 
    //     // setRiders((prev: any) => prev.map((i: any) => i?.name == item?.name ? { ...i, active: false } : i))
    //     // console.log(item)
    //     // setRiders((prev: any) => {
    //     //     const newRiders = prev.map((rider: any) => rider.id == item?.id ? { ...rider, active: false } : rider);

    //     //     console.log('updating rider with ID:', item?.offeredPrice);
    //     //     return newRiders;
    //     // });
    // }

    let decline = (item: any) => {
        setRiders((prev: any) => {
            console.log("prev", prev)
            const updatedRiders = prev.filter((i: any) => i.id !== item.id);
            console.log("Remaining riders after decline:", updatedRiders);
            return updatedRiders;
        });
    }
    const onDecline = (item: any) => {
        console.log(`Declining item with ID: ${item.id}`);

        viewTranslateX.value = withTiming(-400, { duration: 600 }, () => {
            runOnJS(decline)(item)

        });
        viewOpacity.value = withTiming(0, { duration: 600 });
    };


    const onAccept = async (item: any) => {
        viewTranslateX.value = withTiming(-400, { duration: 600 })
        viewOpacity.value = withTiming(0, { duration: 600 })

        // Reference to the specific document
        const rideRef = doc(database, 'rideRequests', requestRef);

        // Delete the document
        await deleteDoc(rideRef);

        let driver = {
            fullName: item?.fullName,
            mobileNumber: item?.mobileNumber,
            vehicleRegistrationNumber: item?.vehicleRegistrationNumber,
            vehicleName: item?.vehicleName,
            profileImage: item?.profileImage
        }
        let fare = item?.offeredFare



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
                        <View style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden", marginRight: 10, backgroundColor: colors.primary[200] }}>
                            <Image source={item.avatar} style={{ width: 40, height: 40 }} resizeMode='contain'></Image>
                        </View>
                        <View>
                            {/* name and no of rides */}
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ marginRight: 5 }} >{item?.name}</Text>
                                <View style={{ marginRight: 5 }}>
                                    <FontAwesome name="star" size={20} color={colors.secondary[400]} />
                                </View>
                                <Text style={{ marginRight: 5 }}>4.78</Text>
                                <Text style={{ color: "#555" }}>(432 rides)</Text>
                            </View>
                            {/* bike name */}
                            <Text>{item?.vehicleName ?? "Motor bike honda shine"}</Text>
                        </View>
                    </View>
                    {/* time */}
                    <View>
                        <Text style={{ fontWeight: 600 }}>4 min.</Text>
                        <Text style={{ fontWeight: 600 }}>1 km</Text>
                    </View>

                </View>
                {/* price */}
                <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontWeight: 600, fontSize: 26, color: "#444" }}>रु </Text>
                    <Text style={{ fontWeight: 700, fontSize: 30 }}>{item.offeredPrice}</Text>
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