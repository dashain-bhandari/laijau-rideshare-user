import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Keyframe } from 'react-native-reanimated';

interface BottomSheetProps {
    children: React.ReactNode
}

const { width, height } = Dimensions.get("window");


const FindRideBottomSheet = forwardRef(function FindRideBottomSheet(props: BottomSheetProps, ref) {
    const { children } = props
    const translateY = useSharedValue(0)
    const opacity = useSharedValue(0)

    useEffect(() => {
        translateY.value = withTiming(-(height) / 2.6, { duration: 500 })
    }, []);

    const animatedScrollViewStyles = useAnimatedStyle(() => (
        {
            transform: [{
                translateY: translateY.value
            }]
        }
    ))


    useImperativeHandle(ref, () => {
        return {
            setTranslateY(translateHeight: number) {
                const ht = translateHeight ?? 5
                translateY.value = withTiming(-height / ht, { duration: 400 });
            }

        };
    }, []);

    return (
        <>
            <Animated.View style={[styles.bottomsheetContainer, animatedScrollViewStyles, {}]}>
                {children}
            </Animated.View>

        </>
    )
}

)

export default FindRideBottomSheet

const styles = StyleSheet.create({
    bottomsheetContainer: {
        position: "absolute",
        height,
        width,
        top: height,
        backgroundColor: "#fff",
        zIndex: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    overlayContainer: {
        position: "absolute",
        height,
        width,
        top: 0,
        zIndex: 10
    }
})