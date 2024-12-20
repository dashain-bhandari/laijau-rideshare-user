import { StyleSheet, Text, TextInputComponent, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SetOnMapProps, SetOnMapScreenProps, SetStopScreenProps } from '../../../../types/types'
import MapView, { Callout, Marker } from 'react-native-maps'
import { TextInput } from 'react-native'
import colors from '../../../../utils/data/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { setDestinationLocation, setStopLocation, setUserLocation } from '../../../../state/location/locationSlice'
import { fallBackAddress } from '../../../../constants/fallBackAddress'
import * as Location from "expo-location"
import { calculateDistance, checkValidDestination } from '../../../../helpers/distance'
import BackButton from '../../../../components/BackButton'


const SetStopScreen = ({ navigation, route }: SetStopScreenProps) => {
    const { userLocation, destinationLocation, stopLocation } = useSelector((state: RootState) => state.location);
    const { tag } = route.params
    const { setScreen } = useSelector((state: RootState) => state.rideRequest);
    const [draggedLocation, setDraggedLocation] = useState<{
        latitude: number,
        longitude: number,
        address: string
    }>({
        latitude: tag == "destination" ? (destinationLocation?.destinationLatitude ?? fallBackAddress.latitude) : tag=="stop"?(stopLocation?.stopLatitude ?? fallBackAddress.latitude):(userLocation?.userLatitude ?? fallBackAddress.latitude),
        longitude: tag == "destination" ? (destinationLocation?.destinationLongitude ?? fallBackAddress.longitude) :  tag=="stop"?(stopLocation?.stopLongitude ?? fallBackAddress.longitude):(userLocation?.userLongitude ?? fallBackAddress.longitude),
        address: ""
    })
    let address = draggedLocation?.address !== "" ? draggedLocation.address : "Select your address";
    const dispatch = useDispatch();

    const onConfirmPress = ({ latitude, longitude, address }: { latitude: number, longitude: number, address: string }) => {
        console.log(destinationLocation)
        if (tag == "stop") {
            dispatch(setStopLocation({
                stopLatitude: latitude,
                stopLongitude: longitude,
                stopAddress: address
            }))
        }
        else if(tag=="destination"){
            dispatch(setDestinationLocation({
                destinationLatitude: latitude,
                destinationLongitude: longitude,
                destinationAddress: address
            }))
        }
        else{
             dispatch(setUserLocation({
                            userLatitude: latitude,
                            userLongitude:longitude,
                           userAddress: address
                        }))
        }

        navigation.popTo("AddDestinationScreen"
        )

    }

    const initialRegion = {
        latitude: tag == "destination" ? (destinationLocation?.destinationLatitude ?? fallBackAddress.latitude) : tag=="stop"?(stopLocation?.stopLatitude ?? fallBackAddress.latitude):(userLocation?.userLatitude ?? fallBackAddress.latitude),
        longitude: tag == "destination" ? (destinationLocation?.destinationLongitude ?? fallBackAddress.longitude) :  tag=="stop"?(stopLocation?.stopLongitude ?? fallBackAddress.longitude):(userLocation?.userLongitude ?? fallBackAddress.longitude),
        latitudeDelta: 0.0056,
        longitudeDelta: 0.0067
    }
   
    return (
        <View style={styles.container}>
            <BackButton onPressHandler={() => navigation.goBack()} />
            <View style={styles.mapContainer}>
                <MapView
                    mapType='mutedStandard'
                    style={{ flex: 1 }}
                    initialRegion={initialRegion}
                    onRegionChange={async (region) => {

                        setDraggedLocation({
                            latitude: region.latitude,
                            longitude: region.longitude,
                            address: ""
                        })
                    }}
                    onRegionChangeComplete={async (region) => {


                        let address = await Location.reverseGeocodeAsync({
                            latitude: region.latitude,
                            longitude: region.longitude
                        })
                        setDraggedLocation({
                            latitude: region.latitude,
                            longitude: region.longitude,
                            address: `${address[0].name},${address[0].region}`
                        })
                    }

                    }
                >
                    <Marker
                        draggable
                        coordinate={{
                            latitude: draggedLocation.latitude,
                            longitude: draggedLocation.longitude
                        }}

                    >

                      
                    </Marker>
                </MapView>
            </View>
            <View style={styles.restContainer}>
                <View style={styles.textInputContainer}>
                    <Text >{address}</Text>
                </View>
                <TouchableOpacity
                    // disabled={!isValid}
                    style={[styles.buttonContainer, {
                        backgroundColor: true ? colors.primary[500] : colors.primary[200]
                    }]} onPress={() => { onConfirmPress(draggedLocation) }}>
                    <Text style={{ color: "#fff", textAlign: "center" }}>Confirm {tag}</Text>
                </TouchableOpacity >
            </View>
        </View>
    )
}

export default SetStopScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    mapContainer: {
        height: "80%"
    },
    restContainer: {
        height: "20%",
        flexDirection: "column",
        backgroundColor: "#fff",
        paddingHorizontal: 16
    },
    textInputContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 4
    },
    buttonContainer: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.primary[500],
        marginTop: 20
    }
    ,
    callout: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
    },
    calloutText: {
        color: 'red',
        fontWeight: 'bold',
    },
})