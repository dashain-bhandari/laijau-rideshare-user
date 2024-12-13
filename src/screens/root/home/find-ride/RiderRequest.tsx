import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { FlatList, ScrollView } from 'react-native';
import RiderRequestItem from './RiderRequestItem';

const { height, width } = Dimensions.get("screen");

const RiderRequest = ({drivers,setRiders}:{
    drivers:{}[],
    setRiders:Dispatch<SetStateAction<any>>
}) => {

 const ref=useRef(null)

 
    return (
        <View style={styles.requestContainer}>
           <FlatList
             keyExtractor={(item:any) => item?.id.toString()} 
           showsVerticalScrollIndicator={false}
           data={drivers}
           renderItem={({item})=><RiderRequestItem item={item} setRiders={setRiders} riders={drivers} ref={ref}/>}
        //    ItemSeparatorComponent={()=><Animated.View style={[animatedSeparator]}></Animated.View>}
           />
        </View>
    )
}

export default RiderRequest

const styles = StyleSheet.create({
    requestContainer: {
        position: "absolute",
        zIndex: 100,
        top: 0.12*height,
        // width, when added width, margin horizontal didnt work so
        height:height/1.5,
        overflow:"hidden",
        marginHorizontal:10,
        borderRadius:10
       
    }
})
