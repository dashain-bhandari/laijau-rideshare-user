import { Dimensions, StyleSheet, Text, TextInputBase, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TextInput } from 'react-native';
import colors from '../utils/data/colors';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigation } from '../types/types';
import { AxiosInstance } from '../config/AxiosInstance';
import CustomBottomSheet from './CustomBottomSheet';

interface SaveNewAddressProps {
    tag: string,
    address?: {
        latitude: number,
        longitude: number,
        addressName: string
    },
    label?: string,
    selectedIcon: string
}

const { height, width } = Dimensions.get("screen");
const SaveNewAddress = ({ tag, address, label, selectedIcon }: SaveNewAddressProps) => {
    const navigation = useNavigation<HomeScreenNavigation>()
    const { user } = useSelector((state: RootState) => state.user);

    const [addressLabel, setAddressLabel] = useState<string | undefined>(undefined);
    const [addressIcon, setAddressIcon] = useState(selectedIcon);
    const [addressName, setAddressName] = useState<string>("")
    useEffect(() => {
        if (tag == "editAddress" && !addressLabel && label) {
            setAddressLabel(label);
        }
    }, [tag])

    useEffect(() => {
        if (tag == "saveNewAddress") {
            setAddressName(address?.addressName!);
        }
        else {
            let address = user?.savedAddresses.find((i) => i.addressLabel == label)
            if (address) {
                setAddressName(address.addressName)
            }
        }
    }, [tag, user, label])

    // animate
    const translateY = useSharedValue(0);
    const infoAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: translateY.value
            }]
        }
    });
    const opacity = useSharedValue(1);
    const inputAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        }
    });
    useEffect(() => {
        if (addressIcon != "Other") {
            opacity.value = withTiming(0, { duration: 500 });
            translateY.value = withTiming(-70, { duration: 500 })
        }
        else {
            opacity.value = withTiming(1, { duration: 500 });
            translateY.value = withTiming(0, { duration: 500 })
        }
    }, [addressIcon])

    //  for the warning displayed on duplicate address labels
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alertResponse, setAlertResponse] = useState(false);

    const onSavePress = async () => {
        try {
            if (user) {
                if (user?.savedAddresses.find((i) => i.addressLabel == addressLabel)) {
                    setDisplayAlert(true)
                }
                else {
                    const { data } = await AxiosInstance.patch(`/user/save-new-address/${user.id}`, {
                        addressLabel,
                        addressName,
                        addressLatitude: address?.latitude,
                        addressLongitude: address?.longitude
                    })
                    console.log("data", data.data)
                    if (data.data) {
                        navigation.pop(3);
                    }
                }
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }



    const sendRequest = async () => {
        try {

            if (user) {

                const { data } = await AxiosInstance.patch(`/user/edit-saved-address/${user.id}`, {
                    addressLabel,
                    addressName,
                    addressLatitude: address?.latitude,
                    addressLongitude: address?.longitude
                })

                console.log("data", data.data)
                if (data.data) {
                    navigation.navigate("AllAddressScreen")
                }

            }

        } catch (error) {
            console.log(error)
        }
        finally {
            setDisplayAlert(false);
        }
    }



    const onCancelPress = () => {

    }


    //alert modal
    const translateModal = useSharedValue(0);

    const animatedModalStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: translateModal.value
            }]
        }
    })

    useEffect(() => {
        if (displayAlert) {
            translateModal.value = withTiming(-height / 5, { duration: 700 })
        }
        else {
            translateModal.value = withTiming(0, { duration: 700 })
        }
    }, [displayAlert])
    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { navigation.goBack() }} style={styles.backButton}>
                        <AntDesign name="arrowleft" size={24} color="#555" />
                    </TouchableOpacity >
                    <Text style={{ fontSize: 16, color: "#333", fontWeight: "500" }}>
                        {
                            tag == "saveNewAddress" ? "Save new address" : "Edit address"
                        }
                    </Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.addressContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={styles.iconBackground}>
                                <Entypo name="location-pin" size={20} color="#555" />
                            </View>
                            <View style={{ marginLeft: 10, maxWidth: 300 }}>
                                <Text>{addressName}</Text>
                            </View>
                        </View>
                        <View>
                            <Entypo name="chevron-small-right" size={24} color="#555" />
                        </View>
                    </View>
                    <View style={styles.addressNameContainer}>
                        <View>
                            <Text style={{ fontSize: 16, color: "#333", fontWeight: "500" }}>Save in this name</Text>
                        </View>
                        <View style={styles.addressListContainer}>
                            {/* home */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setAddressIcon("Home")}
                                style={styles.addressItemContainer}>
                                <View style={[styles.addressIconBackground, { backgroundColor: addressIcon == "Home" ? colors.secondary[300] : "#eee" }]}>
                                    <Entypo name="home" size={20} color={addressIcon == "Home" ? "#fff" : "#555"} />
                                </View>
                                <Text style={styles.addressIconName}>Home</Text>
                            </TouchableOpacity>
                            {/* college */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setAddressIcon("College")}
                                style={styles.addressItemContainer}>
                                <View style={[styles.addressIconBackground, { backgroundColor: addressIcon == "College" ? colors.secondary[300] : "#eee" }]}>

                                    <FontAwesome name="building" size={20} color={addressIcon == "College" ? "#fff" : "#555"} />
                                </View>
                                <Text style={styles.addressIconName}>College</Text>
                            </TouchableOpacity>
                            {/* work */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setAddressIcon("Work")}
                                style={styles.addressItemContainer}>
                                <View style={[styles.addressIconBackground, { backgroundColor: addressIcon == "Work" ? colors.secondary[300] : "#eee" }]}>
                                    <MaterialIcons name="work" size={20} color={addressIcon == "Work" ? "#fff" : "#555"} />
                                </View>
                                <Text style={styles.addressIconName}>Work</Text>
                            </TouchableOpacity>
                            {/* other */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setAddressIcon("Other")}
                                style={styles.addressItemContainer}>
                                <View style={[styles.addressIconBackground, { backgroundColor: addressIcon == "Other" ? colors.secondary[300] : "#eee" }]}>
                                    <MaterialIcons name="bookmark" size={20} color={addressIcon == "Other" ? "#fff" : "#555"} />
                                </View>
                                <Text style={styles.addressIconName}>Other</Text>
                            </TouchableOpacity>
                        </View>

                        {/* input container */}
                        <Animated.View style={[styles.inputContainer, { marginTop: 30 }, inputAnimatedStyle]}>
                            <TextInput
                                value={addressLabel}
                                onChangeText={text => setAddressLabel(text)}
                                placeholder='Address label'
                            />
                        </Animated.View>

                        {/* additional info */}
                        <Animated.View style={[styles.additionalInfoContainer, infoAnimatedStyle]}>
                            <View>
                                <Text>
                                    Additional Information
                                </Text>
                            </View>
                            <View style={[styles.inputContainer, { marginTop: 10 }]}>
                                <TextInput placeholder='additional information'></TextInput>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ color: "#888", paddingLeft: 10, fontSize: 12 }}>
                                    Eg. Road no 10
                                </Text>
                            </View>
                        </Animated.View>
                    </View>

                    <View>

                    </View>
                </View>
                <View style={styles.footer}>

                    <TouchableOpacity
                        onPress={onSavePress}
                        activeOpacity={0.7} style={{ backgroundColor: colors.primary[500], flexGrow: 1, padding: 10, borderRadius: 10 }}>
                        <Text style={{ textAlign: "center", color: "#fff" }}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onCancelPress}
                        activeOpacity={0.7} style={{ borderColor: colors.primary[700], flexGrow: 1, padding: 10, borderRadius: 10, borderWidth: 1 }}>
                        <Text style={{ textAlign: "center", color: colors.primary[700] }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <Animated.View style={[styles.alertModal, animatedModalStyle]}>
                <View style={{ paddingTop: 20, paddingHorizontal: 16 }}>
                    <Text style={{ color: "#333" }}>
                        Another address exists with same name. Are you sure you want to replace it?
                    </Text>
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                        <TouchableOpacity
                            onPress={() => {
                                setDisplayAlert(false);
                            }}
                            activeOpacity={0.7} style={{ backgroundColor: colors.secondary[200], flexGrow: 1, padding: 10, borderRadius: 10, }}>
                            <Text style={{ textAlign: "center", color: "#fff" }}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {

                                sendRequest()
                            }}
                            activeOpacity={0.7} style={{ backgroundColor: colors.secondary[500], flexGrow: 1, padding: 10, borderRadius: 10 }}>
                            <Text style={{ textAlign: "center", color: "#fff" }}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}

export default SaveNewAddress

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        left: 16
    },
    header: {
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomColor: "#eee",
        borderBottomWidth: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    body: {
        flexDirection: "column",
        marginTop: 30,
        paddingHorizontal: 16
    },
    addressContainer: {

        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        gap: 10,
        paddingHorizontal: 16
    },
    iconBackground: {
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: "#eee",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    addressNameContainer: {
        flexDirection: "column",
        marginTop: 30
    },
    addressIconBackground: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: "#eee",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    addressListContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20

    },
    addressItemContainer: {
        flexDirection: "column",
        marginRight: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    additionalInfoContainer: {
        marginTop: 30,
        flexDirection: "column",


    },
    addressIconName: {
        marginTop: 10,
        fontSize: 12
    },
    alertModal: {
        position: "absolute",
        top: height,
        width,
        backgroundColor: "#fff",
        shadowColor: "#ccc",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 4,
        shadowOpacity: 0.6,
        zIndex: 100,
        height
    }
})