import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ParamListBase, RouteProp, useNavigation } from '@react-navigation/native'
import AcceptedRideContent from './AcceptedRideContent'
import Map from '../../../../components/Map'
import CustomBottomSheet from '../../../../components/CustomBottomSheet'
import BackButton from '../../../../components/BackButton'
import { HomeScreenNavigation } from '../../../../types/types'

const AcceptedRide = () => {
    const navigation=useNavigation<HomeScreenNavigation>()
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <BackButton onPressHandler={()=>{
                    navigation.goBack();
                }}/>
                <Map />
                <CustomBottomSheet scrollable={false} initialHeight={2.5}>
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