import { StyleSheet, Text, View, AppState } from 'react-native'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import * as Location from 'expo-location';

import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserLocation } from '../state/location/locationSlice';

const useLocation = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const requestLocation = async () => {
        setLoading(true)
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log(status)
        if (status !== 'granted') {
            setModalOpen(true);
            setLoading(false)
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
      
        //for address
        const address = await Location.reverseGeocodeAsync({
            latitude: location.coords?.latitude!,
            longitude: location.coords?.longitude!
        })

        dispatch(
            setUserLocation({

                userLatitude: location.coords?.latitude!,
                userLongitude: location.coords?.longitude,
                userAddress: `${address[0].name},${address[0].region}`

            })
        )
        setLoading(false);
    }

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const subscription = AppState.addEventListener('change', nextAppState => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            requestLocation()
            console.log('App has come to the foreground!');
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
    });

    const locationAccessPrompt = () => {
        Linking.openSettings();
        setModalOpen(false)
    }

    return {
        modalOpen, setModalOpen, requestLocation, locationAccessPrompt, subscription, loading
    }

}

export default useLocation

const styles = StyleSheet.create({})