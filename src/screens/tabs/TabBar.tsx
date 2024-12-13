import { View, Text, TouchableOpacity, LayoutChangeEvent } from 'react-native';

import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import  Feather  from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../utils/data/colors';
import TabBarButton from './TabBarButton';
import { useState } from 'react';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';

export default function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const [dimensions, setDimensions] = useState({
        height: 20, width: 100
    });

    const buttonWidth = dimensions.width / state.routes.length;

    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        })
    }
    const tabPosition = useSharedValue(124.66666666666667);

    const animatedStyle = useAnimatedStyle(() => {
        console.log(tabPosition.value)

        return (
            {
                transform: [
                    {
                        translateX: tabPosition.value
                    }
                ]
            }
        )
    })
    type RouteName = 'home' | 'offers' | 'ride';

    const icon = {
        home: (props: any) => <Entypo name="home" size={24} {...props}></Entypo>,
        offers: (props: any) => <Ionicons name="notifications" size={24}  {...props}></Ionicons>,
        ride: (props: any) => <FontAwesome name="map-marker" size={24}  {...props}></FontAwesome>,
    }

    return (
        <View onLayout={onTabBarLayout} style={{
            flexDirection: 'row', position: "absolute", overflow: "hidden", alignItems: "center", bottom: 25, backgroundColor: "#fff", paddingVertical: 15, marginHorizontal: 20, borderRadius: 25, borderCurve: "continuous", shadowOffset: {
                width: 0, height: 10
            }, shadowColor: "#ddd", shadowOpacity: 1
        }}>
            <Animated.View
                style={[animatedStyle, { position: "absolute", backgroundColor: colors.primary[200], height: dimensions.height - 15, width: buttonWidth - 25, borderRadius: 25, marginHorizontal: 16 }]}
            />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    console.log("index", index);
                    tabPosition.value = withTiming(buttonWidth * index)
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                let IconComponent

                IconComponent = icon[route.name as RouteName] || ((props: any) => <Feather name='help-circle' size={24}></Feather>)

                return (
                    <TabBarButton
                    key={route.name}
                        routeName={route.name}
                        label={label}
                        isFocused={isFocused}
                        onPress={onPress}
                        onLongPress={onLongPress}></TabBarButton>

                );
            })}

        </View>
    );
}

// // ...

// <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
//   {...}
// </Tab.Navigator>