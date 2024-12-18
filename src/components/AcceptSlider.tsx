import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '../utils/data/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setAutoAccept } from '../state/rideRequest/rideRequestSlice';

const AcceptSlider = () => {
    const translateX=useSharedValue(0);
    const animatedIconStyle=useAnimatedStyle(()=>{
        return {
            transform:[{
                translateX:translateX.value
            }]
        }
    })
   

    const {autoAccept}=useSelector((state:RootState)=>state.rideRequest)
const dispatch=useDispatch();
    useEffect(()=>{
if(autoAccept){
translateX.value=withTiming(24)
}
else{
    translateX.value=withTiming(0)
}
    },[autoAccept])
  return (
    <View style={{backgroundColor:autoAccept?colors.primary[400]:"#ccc",width:"100%",height:34,borderRadius:20,justifyContent:"center",overflow:"hidden"}}>
     <Animated.View style={[{marginHorizontal:5},animatedIconStyle]}>
     <Pressable onPress={()=>dispatch(setAutoAccept(!autoAccept))}>
     <AntDesign name="checkcircle" size={26} color="#fff" />
     </Pressable>
     </Animated.View>
    </View>
  )
}

export default AcceptSlider

const styles = StyleSheet.create({})