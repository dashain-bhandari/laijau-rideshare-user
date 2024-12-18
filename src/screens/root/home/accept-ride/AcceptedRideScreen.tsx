import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ParamListBase, RouteProp } from '@react-navigation/native'
import AcceptedRideContent from './AcceptedRideContent'
import Map from '../../../../components/Map'
import CustomBottomSheet from '../../../../components/CustomBottomSheet'

const AcceptedRide = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Map />
                <CustomBottomSheet scrollable={false} initialHeight={2.7}>
                    <AcceptedRideContent />
                </CustomBottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}

export default AcceptedRide

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})