import { StyleSheet, Text, View } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { TextInput } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { setDestinationLocation } from '../../../../state/location/locationSlice';
import { setSetScreen } from '../../../../state/rideRequest/rideRequestSlice';
import { useTranslation } from 'react-i18next';

const DestinationTextInput = forwardRef(
    function DestinationTextInput(props, ref) {
        useImperativeHandle(ref, () => {
            return {
                focusTextInput() {
                    setTimeout(() => {
                        inputRef.current?.focus()
                    }, 0);
                }
            }
        })
        const inputRef = useRef<TextInput | null>(null)
        const { } = useSelector((state: RootState) => state.rideRequest)
        const dispatch = useDispatch()
        const confirmHandler = ({ latitude, longitude, address }: { latitude: number, longitude: number, address: string }) => {
            dispatch(setDestinationLocation({
                latitude,
                longitude,
                address
            }))
        }
        const {userLocation,destinationLocation}=useSelector((state:RootState)=>state.location)

        const {t}=useTranslation();
        return (
            <View style={{
                padding: 10, borderRadius: 10, borderWidth: 1,
                borderColor: "#ddd", flexDirection: "row", alignItems: "center"
            }}>
                <View style={{ marginRight: 5 }}><Ionicons name="location" size={18} color="black" /></View>
                <TextInput
                    ref={inputRef}
                    onFocus={() => {
                        console.log("huiii")
                        dispatch(setSetScreen({
                            tag: "destination"
                        }))

                    }}
                    value={destinationLocation?.destinationAddress}
                    placeholder={t('placeholders.destination')}></TextInput>
            </View>
        )
    }
)

export default DestinationTextInput

const styles = StyleSheet.create({})