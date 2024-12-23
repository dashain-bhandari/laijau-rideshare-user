import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from '../../../../utils/data/colors';
import { FindDestinationNavigation } from '../../../../types/types';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { setDestinationLocation } from '../../../../state/location/locationSlice';

const YourAddresses = () => {

    const { user } = useSelector((state: RootState) => state.user);


    const navigation = useNavigation<FindDestinationNavigation>();
    const onViewAllPress = () => {
        navigation.navigate("AllAddressScreen")
    }

    const home = user?.savedAddresses?.find((i) => i.addressLabel == "Home")
    const work = user?.savedAddresses?.find((i) => i.addressLabel == "Work")
    const college = user?.savedAddresses?.find((i) => i.addressLabel == "College")
    const dispatch = useDispatch();
    return (
        <View>
            <View style={styles.headingContainer}>
                <Text>Your addresses</Text>
                <TouchableOpacity onPress={onViewAllPress}><Text style={{ color: "#777" }}>view all</Text></TouchableOpacity>
            </View>
            {/* home */}
            <View style={styles.addressContainer}>
                <View style={styles.iconBackground}>
                    <Entypo name="home" size={24} color={"#555"} />
                </View>
                <Pressable
                    onPress={() => {
                        if (home?.addressLongitude) {
                            dispatch(setDestinationLocation(
                                {
                                    destinationLatitude: home?.addressLatitude,
                                    destinationLongitude: home?.addressLongitude,
                                    destinationAddress: home?.addressName
                                }
                            ))
                        }
                    }}
                    style={styles.textContainer}>
                    <Text style={styles.heading}>Home</Text>
                    <Text style={styles.address}> {home?.addressName || "Set an address"}</Text>

                </Pressable>
            </View>
            {/* work */}
            <View style={styles.addressContainer}>
                <View>
                    <View style={styles.iconBackground}>
                        <MaterialIcons name="work" size={24} color="#555" />
                    </View>
                </View>

                <Pressable
                    onPress={() => {
                        if (work?.addressLongitude) {
                            dispatch(setDestinationLocation(
                                {
                                    destinationLatitude: work?.addressLatitude,
                                    destinationLongitude: work?.addressLongitude,
                                    destinationAddress: work?.addressName
                                }
                            ))
                        }
                    }}
                    style={styles.textContainer}>
                    <Text style={styles.heading}>Work</Text>
                    <Text style={styles.address}> {work?.addressName || "Set an address"}</Text>
                </Pressable>

            </View>
            {/* college */}
            <View style={styles.addressContainer}>
                <View>
                    <View style={styles.iconBackground}>
                        <MaterialIcons name="work" size={24} color="#555" />
                    </View>
                </View>

                <Pressable
                    onPress={() => {
                        if (college?.addressLongitude) {
                            dispatch(setDestinationLocation(
                                {
                                    destinationLatitude: college?.addressLatitude,
                                    destinationLongitude: college?.addressLongitude,
                                    destinationAddress: college?.addressName
                                }
                            ))
                        }
                    }}
                    style={styles.textContainer}>
                    <Text style={styles.heading}>College</Text>
                    <Text style={styles.address}> {college?.addressName ?? "Set an address"}</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default YourAddresses

const styles = StyleSheet.create({
    container: {
        flexDirection: "column"
    },
    headingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    addressContainer: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        gap: 5
    },
    iconBackground: {
        backgroundColor: "#eee",
        borderRadius: 10,
        padding: 10
    },
    textContainer: {
        flexDirection: "column",
        gap: 2
    },
    heading: {

    },
    address: {

        color: "#555"
    }
})