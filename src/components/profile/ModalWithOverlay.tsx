import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

interface BottomModalProps {
    modalVisible: boolean
    children: React.ReactNode
    initialHeight?: number
    duration?: number
}
const { height, width } = Dimensions.get("screen");

const BottomModalWithOverlay = ({ modalVisible, children,initialHeight,duration }: BottomModalProps) => {

    const translateY = useSharedValue(0);
    const reqdHeight = initialHeight ?? 3;
    const defaultDuration=duration??500

    const animatedModalStyles = useAnimatedStyle(() => {

        return {
            transform: [{
                translateY: translateY.value
            }]
        }
    })

    useEffect(() => {
        if (modalVisible) {
            translateY.value = withTiming(-height / reqdHeight, { duration: defaultDuration })
        }
        else {
            translateY.value = withTiming(0, { duration: defaultDuration })
        }
    }, [modalVisible])


    const opacity = useSharedValue(0);

    const animatedOverlayStyles = useAnimatedStyle(() => {

        return {
            opacity: opacity.value
        }
    })

    useEffect(() => {
        if (modalVisible) {

            opacity.value = withTiming(0.5, { duration: defaultDuration })
        }
        else {
            opacity.value = withTiming(0, { duration: defaultDuration })
        }
    }, [modalVisible])


    return (
        <>
            <Animated.View style={[animatedModalStyles, styles.modal,]}>
                {children}
            </Animated.View>
            <Animated.View
                pointerEvents={modalVisible ? "auto" : "none"}
                style={[{ flex: 1, position: "absolute", top: 0, width, height, zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', }, animatedOverlayStyles]}>
            </Animated.View>
        </>

    )
}

export default BottomModalWithOverlay

const styles = StyleSheet.create({
    modal: {
        position: "absolute",
        flex: 1,
        top: height,
        backgroundColor: "#fff",
        height: height,
        width: width,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 2

    }
})