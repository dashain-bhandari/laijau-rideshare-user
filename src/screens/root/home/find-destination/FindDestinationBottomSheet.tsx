import { Dimensions, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
const { width, height } = Dimensions.get("screen");
import { TouchableOpacity } from 'react-native';
import PickUpTextInput from "./PickUpTextInput";
import DestinationTextInput from "./DestinationTextInput";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import colors from '../../../../utils/data/colors';
import { FindDestinationScreenProps } from '../../../../types/types';
import YourAddresses from './YourAddresses';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { calculateDistance } from '../../../../helpers/distance';
import { calculatePricings } from '../../../../helpers/price';
import { setInitialPrice, setMinimumPrice } from '../../../../state/rideRequest/rideRequestSlice';

const FindDestinationBottomSheet = ({ navigation }: FindDestinationScreenProps) => {
    const translateY = useSharedValue(0);

    const context = useSharedValue({ y: 0 });
    const [dismissKeyboard, setDismissKeyboard] = useState(false);

    // Define a function to dismiss the keyboard and log
    function dismissKeyboardAndLog() {
        console.log('Dismissing keyboard based on gesture...');
        Keyboard.dismiss();
    }
    function openKeyboard() {
        destinationRef.current?.focusTextInput()
    }

    const destinationRef = useRef<any>(null)

    const gesture = Gesture.Pan().onStart(() => {
        context.value = {
            y: translateY.value
        }
    }).onUpdate((event) => {
        // console.log(event.translationY)//event chai starting position bata suru hucnha so 1.5 ma yo 0 huncha, but context le grda bottom ma 0 banaucha translateY ko value
        translateY.value = event.translationY + context.value.y


        if (event.translationY < 0) {
            translateY.value = withTiming(-0.8 * height)
        }
        if (event.translationY > 0) {
            translateY.value = withTiming(-height / 3,)

        }
    }).onEnd(() => {

        //this doesnt work
        //         runOnJS(
        // Keyboard.dismiss
        //         )()
        runOnJS(dismissKeyboardAndLog)();
    });

    useEffect(() => {
        console.log(dismissKeyboard)
        if (dismissKeyboard) {
            Keyboard.dismiss()
            setDismissKeyboard(false);
        }
    }, [dismissKeyboard]);

    useEffect(() => {
        translateY.value = withTiming(-height * 0.8, { duration: 700 }, () => {
            runOnJS(openKeyboard)()
        })
    }, [])

    const animatedSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: translateY.value
                }
            ]
        }
    });

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            translateY.value = withTiming(-0.8 * height, { duration: 250 })

        })

        return () => {
            showSubscription.remove()
        }
    }, [])

    const inputViewStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(translateY.value, [-height / 1.5, -0.8 * height], [0, 1], Extrapolation.CLAMP),
            height: interpolate(translateY.value, [-height / 1.5, -0.8 * height], [0, 38], Extrapolation.CLAMP),
        }
    })

    // function
    const dispatch = useDispatch()
    const [isValid, setIsValid] = useState(false);
    const { userLocation, destinationLocation } = useSelector((state: RootState) => state.location)
    const { vehicleType } = useSelector((state: RootState) => state.rideRequest)
    const onConfirmDestination = () => {
        //set prices
        let distance = calculateDistance({ lat1: userLocation?.userLatitude!, lat2: destinationLocation?.destinationLatitude!, long1: userLocation.userLongitude!, long2: destinationLocation.destinationLongitude! })
        let { initialPrice, minimumPrice } = calculatePricings({ distance, vehcileType: vehicleType! })
        dispatch(setInitialPrice(initialPrice))
        dispatch(setMinimumPrice(minimumPrice))
        navigation.navigate("FilterRideScreen")
    }

    const onSetOnMapHandler = () => {

        navigation.navigate("SetOnMapScreen")
    }


    useEffect(() => {
        if (userLocation?.userLatitude && userLocation?.userLongitude && destinationLocation?.destinationLatitude && destinationLocation?.destinationLongitude && vehicleType) {
            setIsValid(true)
        }

    }, [userLocation, destinationLocation, vehicleType])
    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.container, animatedSheetStyle]}>
                <View style={styles.line}>
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                    {/* input fields */}
                    <Animated.View style={[inputViewStyle, { marginBottom: 10 }]}>
                        <PickUpTextInput />
                    </Animated.View>
                    <View style={{ height: 38, marginBottom: 20, flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flexGrow: 1 }}>
                            <DestinationTextInput ref={destinationRef} />
                        </View>
                        <Pressable 
                        onPress={()=>{
                            navigation.navigate("AddDestinationScreen")
                        }}
                        style={{ marginLeft: 10, padding: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 10 }}>
                            <AntDesign name="plus" size={20} color="black" />
                        </Pressable>
                    </View>
                    {/* setonmap */}
                    <Pressable style={[styles.setOnMapView, { marginBottom: 20 }]} onPress={onSetOnMapHandler} >
                        <Text>Set on Map</Text>
                        <FontAwesome name="map-pin" size={18} color={colors.secondary[500]} />

                    </Pressable>

                    {/* address list */}

                    <YourAddresses />
                    {/* button */}
                    <TouchableOpacity
                        disabled={!isValid}
                        onPress={onConfirmDestination} style={[styles.confirmDestinationButton, { backgroundColor: isValid ? colors.primary[500] : colors.primary[200], marginTop: 20 }]}>
                        <Text style={{ color: "white", textAlign: "center" }}>Confirm Destination</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </GestureDetector>

    )
}

export default FindDestinationBottomSheet




const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        backgroundColor: "#fff",
        height: height,
        top: height,//so that bottom 0 ma suru huncha top pugda translatey ko value -height huncha thyakka
        width: width,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: "#bbb",
        marginTop: 15,
        marginBottom: 20,
        borderRadius: 2,
        alignSelf: "center"
    },
    clockField: {
        backgroundColor: "#eee",

        padding: 10,
        width: "auto",
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        borderRadius: 10
    },
    setOnMapView: {

        borderRadius: 10,

        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        backgroundColor: "#fff",
        shadowColor: "#ddd",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        borderWidth: 1,
        borderColor: "#eee"
    },
    confirmDestinationButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: colors.primary[500]
    }
})