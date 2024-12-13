import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

import { TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import  colors  from '../../utils/data/colors';

const CustomButton = ({flatlistIndex,flatlistRef,data}:any) => {
    const navigation=useNavigation<any>()
    const AnimatedView=useAnimatedStyle(()=>({
        width:flatlistIndex.value==data-1?withTiming(140):withTiming(60),
        height:60,
        borderRadius:100,
        overflow:"hidden",
        
    }))
    const arrow=useAnimatedStyle(()=>({
        opacity:flatlistIndex.value==data-1?withTiming(0):withTiming(1),
        transform:[{
            translateX:flatlistIndex.value==data-1?withTiming(100):withTiming(0),
        }]
    }))

    const text=useAnimatedStyle(()=>({
        opacity:flatlistIndex.value==data-1?withTiming(1):withTiming(0),
        transform:[{
            translateX:flatlistIndex.value==data-1?withTiming(0):withTiming(-100),
        }]
    }))
  return (
   <TouchableWithoutFeedback  onPress={()=>{
    if(flatlistIndex.value==data-1){
        navigation.navigate("RegisterScreen")
        return
    }
    
    if(flatlistIndex.value!=data-1){
       flatlistRef.current.scrollToIndex({
        index:flatlistIndex.value+1
       })
       return
    }
   
   }}>
    <Animated.View  style={[AnimatedView,{backgroundColor:colors.primary[500],justifyContent:"center",alignItems:"center"}]}>
        <Animated.Text  style={[text,{color:"#fff",position:"absolute"}]}>
            Get started
        </Animated.Text>
      
        <Animated.View style={[arrow,{position:"absolute"}]}>
        <Entypo  name="chevron-right" size={36} color="white" />
        </Animated.View>
    </Animated.View>
   </TouchableWithoutFeedback>


  )
}

export default CustomButton

const styles = StyleSheet.create({})