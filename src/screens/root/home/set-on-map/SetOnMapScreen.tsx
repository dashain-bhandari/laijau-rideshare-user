import { StyleSheet, Text, TextInputComponent, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SetOnMapProps, SetOnMapScreenProps } from '../../../../types/types'
import MapView, { Callout, Marker } from 'react-native-maps'
import { TextInput } from 'react-native'
import colors from '../../../../utils/data/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { setDestinationLocation, setUserLocation } from '../../../../state/location/locationSlice'
import { fallBackAddress } from '../../../../constants/fallBackAddress'
import * as Location from "expo-location"
import { calculateDistance, checkValidDestination } from '../../../../helpers/distance'
import { useTranslation } from 'react-i18next'
import BackButton from '../../../../components/BackButton'


const SetOnMapScreen = ({ navigation }: SetOnMapScreenProps) => {
    const { userLocation, destinationLocation } = useSelector((state: RootState) => state.location);
    const { setScreen } = useSelector((state: RootState) => state.rideRequest);
    const [draggedLocation, setDraggedLocation] = useState<{
        latitude: number,
        longitude: number,
        address: string
    }>({
        latitude: setScreen?.tag == "destination" ? (destinationLocation?.destinationLatitude ?? fallBackAddress.latitude) : (userLocation?.userLatitude ?? fallBackAddress.latitude),
        longitude: setScreen?.tag == "destination" ? (destinationLocation?.destinationLongitude ?? fallBackAddress.longitude) : (userLocation?.userLongitude ?? fallBackAddress.longitude),
        address: ""
    })
    let address = draggedLocation?.address !== "" ? draggedLocation.address : "Select your address"
    const dispatch = useDispatch();
    const onConfirmPress = ({ latitude, longitude, address }: { latitude: number, longitude: number, address: string }) => {
        console.log(destinationLocation)
        if (setScreen?.tag == "pickup") {
            dispatch(setUserLocation({
                userLatitude: latitude,
                userLongitude: longitude,
                userAddress: address
            }))
        }
        else {
            dispatch(setDestinationLocation({
                destinationLatitude: latitude,
                destinationLongitude: longitude,
                destinationAddress: address
            }))
        }

        navigation.goBack()

    }

    const initialRegion = {
        latitude: setScreen?.tag == "destination" ? (destinationLocation?.destinationLatitude ?? fallBackAddress.latitude) : (userLocation?.userLatitude ?? fallBackAddress.latitude),
        longitude: setScreen?.tag == "destination" ? (destinationLocation?.destinationLongitude ?? fallBackAddress.longitude) : (userLocation?.userLongitude ?? fallBackAddress.longitude),
        latitudeDelta: 0.0056,
        longitudeDelta: 0.0067
    }
    let distance;
    let [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (setScreen?.tag == "pickup") {
            setIsValid(true)
        }
        else {
            if (destinationLocation.destinationLatitude && destinationLocation.destinationLongitude) {
                setIsValid(true)
            }

        }
    }, [destinationLocation, setScreen])

    useEffect(() => {
        if (userLocation?.userLatitude && userLocation.userLongitude) {
            distance = calculateDistance({
                lat1: userLocation?.userLatitude, long1: userLocation?.userLongitude, lat2: draggedLocation.latitude, long2: draggedLocation.longitude
            })
            console.log("distance", distance)
            setIsValid(checkValidDestination(distance))
        }
        else {
            console.log(userLocation)
            setIsValid(true)
        }
    }, [draggedLocation.address])

    const { t } = useTranslation()
    return (
        <View style={styles.container}>
            <BackButton onPressHandler={() => { navigation.goBack() }} />
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
                        console.log(destinationLocation)


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

                        <Callout tooltip={true}>
                            {
                                <View style={styles.callout}>
                                    <Text style={styles.calloutText}>Your destination is too near.</Text>
                                </View>
                            }
                        </Callout>
                    </Marker>
                </MapView>
            </View>
            <View style={styles.restContainer}>
                <View style={styles.textInputContainer}>
                    <Text >{address}</Text>
                </View>
                <TouchableOpacity
                    disabled={!isValid}
                    style={[styles.buttonContainer, {
                        backgroundColor: isValid ? colors.primary[500] : colors.primary[200]
                    }]} onPress={() => { onConfirmPress(draggedLocation) }}>
                    <Text style={{ color: "#fff", textAlign: "center" }}>{setScreen?.tag == "pickup" ? "Confirm pickup" : t('buttonTitles.confirmDestination')}</Text>
                </TouchableOpacity >
            </View>
        </View>
    )
}

export default SetOnMapScreen

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