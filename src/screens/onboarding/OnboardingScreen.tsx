import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import OnboardingItem from './OnboardingItem'
import Animated, { interpolate, useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'

import { data } from "../../utils/data/onboarding"

const Onboarding = () => {
  const x = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    x.value = event.contentOffset.x;
  });

  const flatlistRef = useRef(null);
  const flatlistIndex = useSharedValue(0);
  const onViewableChanged = ({ viewableItems }: any) => {
    flatlistIndex.value = viewableItems[0].index
  }
  console.log(x)
  return (
    <SafeAreaView  style={{flex:1,backgroundColor:"#fff"}}>
      <Animated.FlatList
        ref={flatlistRef}
        onScroll={scrollHandler}
        onViewableItemsChanged={onViewableChanged}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) => < OnboardingItem item={item} index={index} x={x} flatlistIndex={flatlistIndex} flatlistRef={flatlistRef} />}
      ></Animated.FlatList>

    </SafeAreaView>
  )
}

export default Onboarding

const styles = StyleSheet.create({})