import { ActivityIndicator, Button, Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ScrollView, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import { AxiosInstance } from '../../config/AxiosInstance';
import colors from '../../utils/data/colors';
import { Route, RouteProp, useNavigation } from '@react-navigation/native';
import { EnterDetailsScreenProps } from '../../types/types';


const { width } = Dimensions.get("screen");



export default function EnterDetailsScreen({ route,navigation }: EnterDetailsScreenProps) {
   
    const [email, onChangeEmail] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [name, onChangeName] = useState<string>("");
    const [errors, setErrors] = useState<any>({});
    const { mobileNumber } = route.params;

    const formValidate = () => {
        let error: any = {};
        if (!email) error.email = "Email is required";
        if (!name) error.name = "Name is required";
        setErrors(error)
        return Object.keys(error).length === 0
    }
    const register = async () => {

        if (formValidate()) {
            setSubmitting(true);
            console.log("hii");
            try {
                const { data } = await AxiosInstance.post("/authentication/register-user", {
                    phoneNumber: mobileNumber,
                    email,
                    name
                });
                console.log(data);

                navigation.navigate(
                  "OtpVerificationScreen",{
                    email
                  }
                );
                setErrors({});
                setSubmitting(false);
            } catch (error: any) {
                console.log(error.message);
                setSubmitting(false);

            }
        }

    }
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <KeyboardAvoidingView contentContainerStyle={{ flex: 1, flexDirection: "column" }} behavior='padding'>
                <ScrollView style={{ marginTop: 30, paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>Add details</Text>
                        <Text style={{ textAlign: "center", marginTop: 10, width: "80%", color: "#555" }}>This will help us verify your email address. We will send you a verification code at your email.</Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#ddd", paddingLeft: 10, marginTop: 10 }}>
                        <MaterialIcons name="email" size={28} color="#666" />
                        <TextInput placeholderTextColor={"#666"} placeholder='Email' style={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20 }}
                            value={email}
                            keyboardType='email-address'
                            onChangeText={
                                (text) => {
                                    onChangeEmail(text);
                                    setErrors({ ...errors, email: null })

                                }

                            }
                        ></TextInput>

                    </View>
                    {
                        errors?.email ? (<Text style={{ marginTop: 5, color: "red" }}>{errors.email}</Text>) : null
                    }
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#ddd", paddingLeft: 10 }}>
                        <FontAwesome name="user" size={28} color="#666" />
                        <TextInput placeholderTextColor={"#666"} placeholder='Name' style={{ backgroundColor: "#ddd", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, flexGrow: 1 }}
                            value={name}
                            onChangeText={(name) => {
                                onChangeName(name);
                                setErrors({ ...errors, name: null });
                            }}
                        ></TextInput>

                    </View>
                    {
                        errors?.name ? (<Text style={{ marginTop: 5, color: "red" }}>{errors.name}</Text>) : null
                    }

                    <TouchableHighlight style={{ backgroundColor: colors.primary[600], paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 10 }} onPress={() => {
                        register()
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: 'space-around',
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
    },
    textInput: {
        height: 40,
        borderColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 36,
    },
    btnContainer: {
        backgroundColor: 'white',
        marginTop: 12,
    },
});