import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'


const Pagination = ({ data, x, width }: any) => {
    
    const Page = ({ index, x, width }: any) => {
        const AnimatedView=useAnimatedStyle(()=>({
            width:interpolate(x.value,[(index-1)*width,index*width,(index+1)*width],[10,20,10],Extrapolation.CLAMP),
            height: 10, backgroundColor: "#d1614c", borderRadius: 100,marginRight:10
        }))
        return (
            <Animated.View style={AnimatedView}>

            </Animated.View>
        )
    }
    return (
        <View  style={{flexDirection:"row",gap:1}}>

            {
                data?.map((item: any, index: any) => {
                    return (
                        <Page key={index} index={index} x={x} width={width}></Page>
                    )
                })
            }

        </View>
     


    )
}

export default Pagination

const styles = StyleSheet.create({})