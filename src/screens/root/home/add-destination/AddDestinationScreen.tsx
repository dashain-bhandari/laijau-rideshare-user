import { ActivityIndicator, Alert, Button, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ScrollView, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import colors from '../../../../utils/data/colors';
import { useDispatch, useSelector } from 'react-redux';
import { setDistanceInKm, setFriendDetail, setInitialPrice, setMinimumPrice, setOfferedPrice } from '../../../../state/rideRequest/rideRequestSlice';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AddDestinationScreenProps } from '../../../../types/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RootState } from '../../../../state/store';
import { setDestinationLocation } from '../../../../state/location/locationSlice';
import { calculateDistance } from '../../../../helpers/distance';
import { calculatePricings } from '../../../../helpers/price';
import { useTranslation } from 'react-i18next';

const AddDestinationScreen = ({ navigation }: AddDestinationScreenProps) => {
    const [submitting, setSubmitting] = useState<boolean>(false);

    const { destinationLocation, stopLocation, userLocation } = useSelector((state: RootState) => state.location)

    const [name, setName] = useState("");
    const [no, setNo] = useState("");
    const dispatch = useDispatch();
    const { vehicleType } = useSelector((state: RootState) => state.rideRequest)
    const onSubmit = () => {
        if (name == "" || no == "") {
            Alert.alert("Both name and mobile number are required.")
        }
        else {
            dispatch(setFriendDetail({
                friendName: name,
                friendNo: no
            }))
            navigation.navigate("FindDestinationScreen")
        }

    }

    const onPickupPress = () => {
        navigation.navigate("AddStopScreen", { tag: "pickup" })
    }
    const onStopPress = () => {
        navigation.navigate("AddStopScreen", { tag: "stop" })
    }

    const onDestinationPress = () => {
        navigation.navigate("AddStopScreen", { tag: "destination" })
    }

    const [valid, setValid] = useState(false);

    useEffect(() => {
        if (
            !(stopLocation.stopLongitude && stopLocation.stopLatitude) && !(destinationLocation.destinationLongitude && destinationLocation.destinationLatitude)
        ) {
            setValid(false)
        }
        else {
            setValid(true);
        }

    }, [destinationLocation, stopLocation])

    const onConfirm = async () => {

        if ((stopLocation.stopLongitude && stopLocation.stopLatitude) && !(destinationLocation.destinationLongitude && destinationLocation.destinationLatitude)) {

            let distance = calculateDistance({ lat1: userLocation?.userLatitude!, lat2: stopLocation?.stopLatitude!, long1: userLocation.userLongitude!, long2: stopLocation.stopLongitude! })
            let { initialPrice, minimumPrice } = await calculatePricings({ distance, vehicleType: vehicleType!, coordinates: { latitude: userLocation?.userLatitude!, longitude: userLocation?.userLongitude! } })
           dispatch(setDistanceInKm(distance))
            dispatch(setInitialPrice(initialPrice));
            dispatch(setOfferedPrice(initialPrice))
            dispatch(setMinimumPrice(minimumPrice));

            dispatch(setOfferedPrice(initialPrice));
            //set destination with stop
            setTimeout(() => {
                dispatch(setDestinationLocation({
                    destinationLatitude: stopLocation.stopLatitude,
                    destinationLongitude: stopLocation.stopLongitude,
                    destinationAddress: stopLocation.stopAddress
                }))
            }, 5000);
        }
        else {
            let distance1 = calculateDistance({ lat1: userLocation?.userLatitude!, lat2: stopLocation?.stopLatitude!, long1: userLocation.userLongitude!, long2: stopLocation.stopLongitude! })
            let distance2 = calculateDistance({ lat1: stopLocation?.stopLatitude!, lat2: destinationLocation?.destinationLatitude!, long1: stopLocation.stopLongitude!, long2: destinationLocation.destinationLongitude! })
            console.log("distance heee",distance1+distance2)
            let { initialPrice, minimumPrice } = await calculatePricings({ distance: distance1 + distance2, vehicleType: vehicleType!, coordinates: { latitude: userLocation?.userLatitude!, longitude: userLocation?.userLongitude! } })
            dispatch(setDistanceInKm(distance1+distance2))
            dispatch(setOfferedPrice(initialPrice))
            dispatch(setInitialPrice(initialPrice))
            dispatch(setMinimumPrice(minimumPrice))
        }

        navigation.navigate("FilterRideScreen")

    }

    const {t}=useTranslation()

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <Pressable style={{ paddingHorizontal: 16 }} onPress={() => { navigation.goBack() }}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>
                <KeyboardAvoidingView contentContainerStyle={{ flex: 1, flexDirection: "column" }}>
                    <ScrollView style={{ marginTop: 30, paddingHorizontal: 16 }}>
                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
                            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>{t('yourTrip')}</Text>
                            <Text style={{ textAlign: "center", marginTop: 10, width: "80%", color: "#555" }}>{t('stopWarning')}</Text>
                        </View>
                        <Pressable
                            onPress={onPickupPress}
                            style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingLeft: 10, marginTop: 20, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" }}>
                            <MaterialCommunityIcons name="human-handsup" size={24} color={colors.primary[500]} />
                            <TextInput
                                style={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 }}
                                pointerEvents='none'
                                placeholderTextColor={"#666"} placeholder='Pick up'
                                value={userLocation?.userAddress}

                            ></TextInput>

                        </Pressable>

                        <Pressable
                            onPress={onStopPress}

                            style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingLeft: 10, marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" }}>



                            <MaterialCommunityIcons name="numeric-1-circle" size={24} color={colors.primary[500]} />

                            <TextInput
                                editable={false}
                                pointerEvents='none'
                                placeholderTextColor={"#666"} placeholder={t('searchStop')}
                                style={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 }}
                                value={stopLocation?.stopAddress}

                            ></TextInput>


                        </Pressable>

                        <Pressable
                            onPress={onDestinationPress}
                            style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingLeft: 10, marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" }}>

                            <Entypo name="location-pin" size={24} color={colors.primary[500]} />
                            <TextInput
                                pointerEvents='none'
                                editable={false}
                                placeholderTextColor={"#666"} placeholder={t('searchDestination')} style={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 }}
                                value={destinationLocation?.destinationAddress}

                            ></TextInput>

                        </Pressable>
                        <TouchableHighlight style={{ backgroundColor: colors.primary[600], paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 20 }} onPress={() => {
                            onConfirm()
                        }} underlayColor={"#9DA9A0"}>
                            <View>
                                {
                                    submitting ? (<><ActivityIndicator color={"#fff"}></ActivityIndicator></>) : (<Text style={{ textAlign: "center", color: "#fff" }}>{t('next')}</Text>)
                                }
                            </View>
                        </TouchableHighlight>
                    </ScrollView>


                </KeyboardAvoidingView>

            </SafeAreaView>
        </View>
    )
}

export default AddDestinationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})