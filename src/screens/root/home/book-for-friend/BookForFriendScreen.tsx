import { ActivityIndicator, Alert, Button, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ScrollView, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import colors from '../../../../utils/data/colors';
import { useDispatch } from 'react-redux';
import { setBookedForFriend, setFriendDetail } from '../../../../state/rideRequest/rideRequestSlice';
import { BookForFriendScreenProps } from '../../../../types/types';
import AntDesign from '@expo/vector-icons/AntDesign';

const BookForFriendScreen = ({ navigation }: BookForFriendScreenProps) => {
    const [submitting, setSubmitting] = useState<boolean>(false);


    const [name, setName] = useState("");
    const [no, setNo] = useState("");
    const dispatch = useDispatch();

    const onSubmit = () => {
        if (name == "" || no == "") {
            Alert.alert("Both name and mobile number are required.")
        }
        else {
            dispatch(setBookedForFriend(true));
            dispatch(setFriendDetail({
                friendName: name,
                friendNumber: no
            }))
            navigation.navigate("FindDestinationScreen")
        }

    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <Pressable style={{ paddingHorizontal: 16 }} onPress={() => { navigation.goBack() }}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>
                <KeyboardAvoidingView contentContainerStyle={{ flex: 1, flexDirection: "column" }}>
                    <ScrollView style={{ marginTop: 30, paddingHorizontal: 16 }}>
                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
                            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>Enter friend's details</Text>
                            <Text style={{ textAlign: "center", marginTop: 10, width: "80%", color: "#555" }}>This will help us ensure smooth riding experience for your friend.</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "center", alignItems: "center", backgroundColor: "#eee", paddingLeft: 10, borderRadius: 10 }}>
                            <FontAwesome name="user" size={24} color="#666" />
                            <TextInput placeholderTextColor={"#666"} placeholder='Name' style={{ backgroundColor: "#eee", paddingHorizontal: 10, paddingVertical: 10, flexGrow: 1, borderRadius: 10 }}
                                value={name}
                                onChangeText={text => setName(text)}
                            ></TextInput>

                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#eee", paddingLeft: 10, marginTop: 10, borderRadius: 10 }}>
                            <MaterialIcons name="call" size={24} color="#666" />
                            <TextInput placeholderTextColor={"#666"} placeholder='Phone number' style={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 }}
                                value={no}
                                onChangeText={text => setNo(text)}
                            ></TextInput>

                        </View>
                        <TouchableHighlight style={{ backgroundColor: colors.primary[600], paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 20 }} onPress={() => {
                            onSubmit()
                        }} underlayColor={"#9DA9A0"}>
                            <View>
                                {
                                    submitting ? (<><ActivityIndicator color={"#fff"}></ActivityIndicator></>) : (<Text style={{ textAlign: "center", color: "#fff" }}>Next</Text>)
                                }
                            </View>
                        </TouchableHighlight>
                    </ScrollView>


                </KeyboardAvoidingView>

            </SafeAreaView>
        </View>
    )
}

export default BookForFriendScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})