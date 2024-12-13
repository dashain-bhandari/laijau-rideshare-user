import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'


import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BackButton from '../../../../components/BackButton'
import Map from '../../../../components/Map'
import FindDestinationBottomSheet from './FindDestinationBottomSheet'
import { FindDestinationScreenProps } from '../../../../types/types'
import { useDispatch } from 'react-redux'
import { setDestinationLocation } from '../../../../state/location/locationSlice'


const FindDestination = ({ navigation, route }: FindDestinationScreenProps) => {
  const dispatch = useDispatch()
  
  //for reseting my input field

  const onBackButtonPress = () => {
    dispatch(setDestinationLocation({
      destinationLatitude: undefined,
      destinationLongitude: undefined,
      destinationAddress: undefined,
    }))
    navigation.goBack()

  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BackButton onPressHandler={onBackButtonPress} />
      <Map />
      <FindDestinationBottomSheet navigation={navigation} route={route} />
    </GestureHandlerRootView>
  )
}

export default FindDestination

const styles = StyleSheet.create({

})