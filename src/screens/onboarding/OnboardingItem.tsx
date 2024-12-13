import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'

import Pagination from "./Pagination"
import CustomButton from "./CustomButton"
import { TouchableOpacity } from 'react-native'

import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { data } from '../../utils/data/onboarding'
import { useNavigation } from '@react-navigation/native'

const { width, height } = Dimensions.get("screen")

const OnboardingItem = ({ item, index, x ,flatlistIndex,flatlistRef}: any) => {
    const navigation=useNavigation<any>()
    console.log("x", x)
    console.log("first")
    const animatedItem = useAnimatedStyle(() => ({
        opacity: interpolate(x.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 1, 0], Extrapolation.CLAMP),
        transform: [
            {
                translateY: interpolate(x.value, [(index - 1) * width, index * width, (index + 1) * width], [30, 0, 30], Extrapolation.CLAMP)
            }
        ]
    }))
    const animatedImageStyle = useAnimatedStyle(() => ({
        opacity: interpolate(x.value, [(index - 1) * width, index * width, (index + 1) * width], [0, 1, 0], Extrapolation.CLAMP),
        transform: [
            {
                translateY: interpolate(x.value, [(index - 1) * width, index * width, (index + 1) * width], [30, 0, 30], Extrapolation.CLAMP)
            }
        ],
        width: 0.7 * width, height: 300

    }));
   
      
    return (
        <ScrollView contentContainerStyle={{ flex: 1,width, justifyContent:"space-between",paddingHorizontal:24, alignItems: "center",marginTop:40 }} style={{ width: width }}>
            <Animated.View style={[{ ...animatedItem },{width:"100%"}]} >
               
                    <TouchableOpacity style={{alignSelf:"flex-end",marginTop:10}}
                        onPress={() => navigation.navigate("RegisterScreen")}
                    >
                        {
                            index!==data?.length-1 && <Text style={{fontWeight:"bold"}} >
                            Skip
                        </Text>
                        }
                    </TouchableOpacity>
              
                <Animated.View   style={[animatedItem,{flexDirection:"column",alignItems:"center",marginTop:40}]}>
                    <Animated.Image source={item.image} style={animatedImageStyle}></Animated.Image>
                    <View  style={{flexDirection:"column",alignItems:"center",gap:2}}>
                        <Text style={{fontWeight:"bold",color:"#699794",textAlign:"center",fontSize:20,marginTop:20}} >{item.title}</Text>
                        <Text  style={{textAlign:"center",marginTop:10}}>{item.decsription}</Text>
                    </View>

                </Animated.View>
            </Animated.View>
            <View  style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:40}}>
                <Pagination  data={data} x={x} width={width}/>
                <CustomButton  flatlistRef={flatlistRef} flatlistIndex={flatlistIndex} data={data.length}/>
            </View>
        </ScrollView>
  
    )
}

export default OnboardingItem

const styles = StyleSheet.create({})