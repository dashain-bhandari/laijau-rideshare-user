import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { ComponentType, Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { transform } from '@babel/core'
import { TextInput } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import { TouchableOpacity } from 'react-native-gesture-handler'
import StyledButton from '../../../../styled/StyledButton'
import colors from '../../../../utils/data/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import { setOfferedPrice } from '../../../../state/rideRequest/rideRequestSlice'
const { height, width } = Dimensions.get("screen")

const PriceInputModal = ({ priceModal, setPriceModal }: {
    priceModal: boolean,
    setPriceModal: Dispatch<SetStateAction<boolean>>
}) => {


    const inputref = useRef<TextInput | null>(null)
    const translateY = useSharedValue(0);
    useEffect(() => {
        if (priceModal) {
            translateY.value = withSpring(-height / 1.5, { damping: 12 })
        }
        else {
            translateY.value = withSpring(0, { damping: 12 })
        }
    }, [priceModal])

    const animatedModalStyles = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: translateY.value
            }]
        }
    })

    const opacity = useSharedValue(0);
    const animatedOverlay = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        }
    })

    useEffect(() => {
        if (priceModal) {
            opacity.value = withTiming(0.5, { duration: 200 })
        }
        else {
            opacity.value = withTiming(0, { duration: 200 })
        }
    }, [priceModal])

  
    const [isValid, setIsValid] = useState(false);
    const { initialPrice, minimumPrice, offeredPrice } = useSelector((state: RootState) => state.rideRequest)
    console.log("initial",initialPrice)
    const dispatch = useDispatch()

    const [price, setPrice] = useState(initialPrice?String(initialPrice):"");
    useEffect(() => {
        if (minimumPrice) {
            console.log("minimum",minimumPrice)
            if (parseInt(price) >= minimumPrice) {
                setIsValid(true)
            }
            if(parseInt(price)<minimumPrice){
                setIsValid(false)
            }
        }
        else {
      
            setIsValid(true)
        }
    }, [price, minimumPrice])

    const onConfirmPress = () => {

        dispatch(setOfferedPrice(parseInt(price)))
         setPriceModal(false);
    }
    return (
        <>
            {
                priceModal &&
                (
                    <Animated.View style={[styles.priceModalStyles, animatedModalStyles]}>
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                                <View style={{ flexGrow: 1 }}>
                                    <Text style={{ textAlign: "center" }}>Offer your fare</Text>
                                </View>

                                <TouchableOpacity onPress={() => setPriceModal(false)}>
                                    <Entypo name="cross" size={20} color="#888" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
                                <Text style={{ marginRight: 5, fontSize: 36, color: "#555" }}>रु</Text>
                                <TextInput
                                    value={price}
                                    onChangeText={(text) => {
                                        setPrice(text)
                                    }}
                                    keyboardType='numeric'
                                    ref={inputref}
                                    onLayout={() => inputref.current?.focus()}
                                    placeholder=""

                                    style={[styles.textInputStyles, {
                                        color: isValid ? "#111" : "red"
                                    }]}
                                >

                                </TextInput>

                            </View>
                            <View style={{ marginTop: 10 }}>
                                {
                                    isValid ? (<Text style={{ textAlign: "center" }}>Recommended price is rs. {initialPrice}</Text>) : (
                                        <Text style={{ textAlign: "center", color: "red" }}>Minimum price is rs. {minimumPrice}</Text>
                                    )
                                }
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <StyledButton
                                    disabled={!isValid}
                                    title='Done'
                                    buttonStyles={{ backgroundColor: isValid ? colors.primary[500] : "#ccc" }}
                                    textStyles={{ color: "#fff" }}
                                    onPress={onConfirmPress}
                                ></StyledButton>
                            </View>
                        </View>
                    </Animated.View>
                )
            }


            {

                (
                    <Animated.View
                        pointerEvents='none'
                        style={[
                            animatedOverlay, {
                                flex: 1,
                                width,
                                height, backgroundColor: "rgba(0,0,0,0.5)",
                                position: "absolute"
                            }
                        ]}
                    >
                    </Animated.View>
                )
            }


        </>
    )
}

export default PriceInputModal

const styles = StyleSheet.create({
    priceModalStyles: {
        position: "absolute",
        height: height,
        backgroundColor: "#fff",
        width,
        top: height,
        paddingTop: 20,
        paddingHorizontal: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 1

    },
    textInputStyles: {
        padding: 10,
        fontSize: 36

    }
})