import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import colors from '../../../../utils/data/colors';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLocation } from '../../../../state/location/locationSlice';
import { setSetScreen } from '../../../../state/rideRequest/rideRequestSlice';
import { RootState } from '../../../../state/store';

const PickUpTextInput = () => {
    const dispatch = useDispatch()
    let confirmHandler = ({ latitude, longitude, address }: { latitude: number, longitude: number, address: string }) => {
        dispatch(setUserLocation({
            latitude,
            longitude,
            address
        }))
    }

    const {userLocation}=useSelector((state:RootState)=>state.location)
    return (
        <View style={{
            padding: 10, borderRadius: 10, flexDirection: "row", alignItems: "center", borderWidth: 1,
            borderColor: "#ddd"
        }}>
            <View style={{ marginRight: 5 }}>
                <FontAwesome5 name="arrow-circle-down" size={16} color={colors.primary[500]} />
            </View>
            <TextInput
            value={userLocation?.userAddress}
                onFocus={() => {

                    dispatch(setSetScreen({
                            
                            tag: "pickup"
                        
                    }))

                }}
                placeholder='pick up'></TextInput>

        </View>
    )
}

export default PickUpTextInput

const styles = StyleSheet.create({})