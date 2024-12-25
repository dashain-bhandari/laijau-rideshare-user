import { ActivityIndicator, Alert, Button, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ScrollView, TextInput } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AddStopScreenProps } from '../../../../types/types'
import colors from '../../../../utils/data/colors';
import YourAddresses from '../find-destination/YourAddresses';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';

const AddStopScreen = ({ navigation, route }: AddStopScreenProps) => {
    const { tag } = route.params;

    const onSetOnMapPress = () => {
        navigation.navigate("SetStopScreen", {
            tag
        })
    }

    const [value, setValue] = useState<string>("");
    const { userLocation, destinationLocation, stopLocation } = useSelector((state: RootState) => state.location)
    useEffect(() => {
        if (tag == "stop" && stopLocation.stopAddress) {
            setValue(stopLocation?.stopAddress)
        }
        if (tag == "destination" && destinationLocation.destinationAddress) {
            setValue(destinationLocation?.destinationAddress)
        }
        if (tag == "pickup" && userLocation.userAddress) {
            setValue(userLocation?.userAddress)
        }
    }, [tag, userLocation, stopLocation, destinationLocation])
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Pressable style={{ paddingHorizontal: 16 }} onPress={() => { navigation.goBack() }}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>

                <ScrollView style={{ marginTop: 30, paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>Search {tag}</Text>
                    </View>

                    <View style={{
                        padding: 10, borderRadius: 10, borderWidth: 1,
                        borderColor: "#ddd", flexDirection: "row", alignItems: "center",
                        marginTop: 20
                    }}>
                        <View style={{ marginRight: 5 }}><Ionicons name="location" size={18} color="#555" /></View>
                        <TextInput

                            value={value}
                            placeholder={tag}></TextInput>
                    </View>
                    <Pressable
                        onPress={onSetOnMapPress}
                        style={[styles.setOnMapView, { marginTop: 20, marginBottom: 20 }]} >
                        <Text>Set on Map</Text>
                        <FontAwesome name="map-pin" size={18} color={colors.secondary[500]} />

                    </Pressable>
                    {/* <YourAddresses /> */}


                </ScrollView>




            </SafeAreaView>
        </View>
    )
}

export default AddStopScreen

const styles = StyleSheet.create({

    setOnMapView: {

        borderRadius: 10,

        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        backgroundColor: "#fff",
        shadowColor: "#ddd",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        borderWidth: 1,
        borderColor: "#eee"
    },
})