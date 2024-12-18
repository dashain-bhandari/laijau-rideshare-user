import { Alert, AppState, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context';

import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '../utils/data/colors';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigation } from '../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
const ScheduledRide = () => {
    const navigation = useNavigation<HomeScreenNavigation>()
    const { scheduledRide } = useSelector((state: RootState) => state.scheduledRide);
    return (
        <>
            {
                scheduledRide?.rideId ? (
                    <Pressable style={{ flex: 1, marginTop: 20, }}>
                        <View style={{ flexDirection: "column", gap: 5 }}>
                            <Text style={{ fontWeight: "500", color: "#555", fontSize: 14 }}>Scheduled Ride</Text>
                            <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 10, gap: 15, borderColor: "#ddd", borderWidth: 1 }}>
                                {/* user pickup */}
                                <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginTop: 10 }}>
                                    <View style={{
                                        backgroundColor: "#fff", width: 30, height: 30, borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor:
                                            "#ddd"
                                    }}>
                                        <AntDesign name="arrowdown" size={20} color={colors.primary[500]} />
                                    </View>
                                    <View style={{ maxWidth: "80%" }}>
                                        <Text>{scheduledRide.pickup.userAddress}</Text>
                                    </View>
                                </View>
                                {/* destination */}
                                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                    <View style={{ backgroundColor: "#fff", width: 30, height: 30, borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#ddd" }}>
                                        <AntDesign name="arrowdown" size={20} color={colors.primary[500]} />
                                    </View>
                                    <View style={{ maxWidth: "80%" }}>
                                        <Text>{scheduledRide?.dropoff?.destinationAddress}</Text>
                                    </View>
                                </View>
                                {/* button */}
                                <Pressable
                                   
                                   style={{ backgroundColor: colors.secondary[400], padding: 10, borderRadius: 10, marginBottom: 10 }}>
                                    <Text style={{ textAlign: "center", color: "#fff" }}>{scheduledRide?.scheduledDate}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                ) : (
                    <>
                        <Pressable style={{ flex: 1, marginTop: 20,  }}>
                            <View style={{ flexDirection: "column", gap: 5 }}>
                                <Text style={{ fontWeight: "500", color: "#555", fontSize: 14 }}>Ongoing Ride</Text>
                                <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 10, gap: 15, borderColor: "#ddd", borderWidth: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                                    <View>
                                        <Image style={{ width: 150, height: 150 }} source={require("../assets/images/no-result.png")}></Image>
                                    </View>
                                    <Text style={{marginBottom:10,textAlign:"center",color:"#555"}}>You have no ride at the moment!</Text>
                                </View>
                            </View>
                        </Pressable>

                    </>
                )
            }
        </>
    )
}

export default ScheduledRide

const styles = StyleSheet.create({})