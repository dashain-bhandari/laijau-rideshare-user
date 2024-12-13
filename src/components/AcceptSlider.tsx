import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '../utils/data/colors';

const AcceptSlider = () => {
    const translateX=useSharedValue(0);
    const animatedIconStyle=useAnimatedStyle(()=>{
        return {
            transform:[{
                translateX:translateX.value
            }]
        }
    })
    const [isAccepted,setIsAccepted]=useState(false);

    useEffect(()=>{
if(isAccepted){
translateX.value=withTiming(24)
}
else{
    translateX.value=withTiming(0)
}
    },[isAccepted])
  return (
    <View style={{backgroundColor:isAccepted?colors.primary[500]:"#ccc",width:"100%",height:34,borderRadius:20,justifyContent:"center",overflow:"hidden"}}>
     <Animated.View style={[{marginHorizontal:5},animatedIconStyle]}>
     <Pressable onPress={()=>setIsAccepted(!isAccepted)}>
     <AntDesign name="checkcircle" size={26} color="#fff" />
     </Pressable>
     </Animated.View>
    </View>
  )
}

export default AcceptSlider

const styles = StyleSheet.create({})