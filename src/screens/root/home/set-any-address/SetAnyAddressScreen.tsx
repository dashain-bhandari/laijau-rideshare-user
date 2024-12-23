import { StyleSheet, Text, TextInputComponent, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SetAnyAddressScreenProps, SetOnMapProps, SetOnMapScreenProps } from '../../../../types/types'
import MapView, { Callout, Marker } from 'react-native-maps'
import { TextInput } from 'react-native'
import colors from '../../../../utils/data/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { setDestinationLocation, setUserLocation } from '../../../../state/location/locationSlice'
import { fallBackAddress } from '../../../../constants/fallBackAddress'
import * as Location from "expo-location"
import { calculateDistance, checkValidDestination } from '../../../../helpers/distance'
import { AxiosInstance } from '../../../../config/AxiosInstance'
import BackButton from '../../../../components/BackButton'
import { useTranslation } from 'react-i18next'


const SetAnyAddressScreen = ({ navigation, route }: SetAnyAddressScreenProps) => {
    const {
        tag,
        selectedIcon,
        addressLatitude,
        addressLongitude,
        addressName
    } = route.params
    const { userLocation, destinationLocation } = useSelector((state: RootState) => state.location);
    const { setScreen } = useSelector((state: RootState) => state.rideRequest);
    const [draggedLocation, setDraggedLocation] = useState<{
        latitude: number,
        longitude: number,
        address: string
    }>({
        latitude: addressLatitude ?? userLocation?.userLatitude ?? fallBackAddress.latitude,
        longitude: addressLongitude ?? userLocation?.userLongitude ?? fallBackAddress.longitude,
        address: addressName || userLocation?.userAddress || "Shiva Shakri marga"
    })
    let address = draggedLocation?.address !== "" ? draggedLocation.address : addressName || userLocation?.userAddress || "Chaitya marga, Bagmati"
    const dispatch = useDispatch();


    const onConfirmPress = ({ latitude, longitude, address }: { latitude: number, longitude: number, address: string }) => {
        if (!draggedLocation?.address) {
            address = addressName || userLocation?.userAddress || "Chaitya marga, Bagmati"
        }
        if (tag == "editAddress") {
            navigation.navigate("SaveNewAddressScreen", {
                tag: "editAddress",
                selectedIcon,
                address: {
                    latitude,
                    longitude,
                    addressName: address
                },

            })
        }
        else {
            navigation.navigate("SaveNewAddressScreen", {
                tag: "saveNewAddress",
                selectedIcon: "Other",
                address: {
                    latitude,
                    longitude,
                    addressName: address
                },

            })
        }

    }

    const initialRegion = {
        latitude: (userLocation?.userLatitude ?? fallBackAddress.latitude),
        longitude: (userLocation?.userLongitude ?? fallBackAddress.longitude),
        latitudeDelta: 0.0056,
        longitudeDelta: 0.0067
    }


    const {t}=useTranslation()

    return (
        <View style={styles.container}>
            <BackButton onPressHandler={()=>navigation.goBack()}/>
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


                    </Marker>
                </MapView>
            </View>
            <View style={styles.restContainer}>
                <View style={styles.textInputContainer}>
                    <Text >{address}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.buttonContainer, {
                        backgroundColor: colors.primary[400],
                    }]} onPress={() => { onConfirmPress(draggedLocation) }}>
                    <Text style={{ color: "#fff", textAlign: "center" }}>{t('buttonTitles.confirmAddress')}</Text>
                </TouchableOpacity >
            </View>
        </View>
    )
}

export default SetAnyAddressScreen

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