import { Dimensions, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { AllAddressScreenProps, HomeScreenNavigation } from '../../../../types/types'
import { FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../state/store'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'
import colors from '../../../../utils/data/colors'
import Animated from 'react-native-reanimated'
import { MenuView, MenuComponentRef } from '@react-native-menu/menu';
import { AxiosInstance } from '../../../../config/AxiosInstance'
import { setUser } from '../../../../state/user/userSlice'
import { setDestinationLocation } from '../../../../state/location/locationSlice'


const { width, height } = Dimensions.get("screen");

const AllAddressScreen = ({ navigation }: AllAddressScreenProps) => {

    const { user } = useSelector((state: RootState) => state.user)

    console.log("user", user)
    const [edit, setEdit] = useState(false);
    return (
        <View style={{
            flex: 1,
        }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={24} color={"#555"}></AntDesign>
                    </Pressable>
                    <View>
                        <Text style={{ fontSize: 16, color: "#333", fontWeight: "500" }}>Your addresses</Text>
                    </View>
                    <Pressable onPress={() => { setEdit(!edit) }}>
                        <Text>
                            {
                                edit ? "Done" : "Edit"
                            }
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.allAddressContainer}>
                    <FlatList
                        ItemSeparatorComponent={() => <View style={{
                            borderWidth: 0.5
                            , borderColor: "#eee"
                        }}></View>}
                        data={user?.savedAddresses}
                        renderItem={({ item }) => <AddressItem item={item} edit={edit} />}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.addNewAddress} onPress={() => {
                        navigation.navigate("AddNewAddressScreen", { tag: "saveNewAddress", selectedIcon: "Other" })
                    }}>
                    <View style={[styles.itemIcon, { backgroundColor: colors.secondary[300] }]}>

                        {
                            (
                                <MaterialIcons name="bookmark-add" size={24} color="#fff" />
                            )
                        }
                    </View>

                    <View style={{ marginLeft: 10 }}

                    >
                        <Text>
                            Add new address
                        </Text>
                    </View>

                </TouchableOpacity>
            </View>

            {/* options modal */}
            <Animated.View>

            </Animated.View>
        </View>
    )
}

export default AllAddressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: 60,
        paddingBottom: 10

    },
    allAddressContainer: {
        marginTop: 5,
        backgroundColor: "#fff",
    },
    itemIcon: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: "#eee",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,

    },
    addressContainer: {
        marginLeft: 10,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexGrow: 1

    },
    addNewAddress: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 10
    },
    optionsModal: {
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

const AddressItem = ({ item, edit }: { item: any, edit: boolean }) => {
    const navigation = useNavigation<HomeScreenNavigation>()
    const menuRef = useRef<MenuComponentRef>(null);
    const { user } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch();
    const handlePressAction = async (id: string) => {
        if (id == "delete") {
            if (item?.addressLabel && user?.id) {
                try {
                    const { data } = await AxiosInstance.delete(`/user/delete-saved-address/${user?.id}/${item?.addressLabel}`);
                    console.log(data?.data);
                    if (data?.data) {
                        dispatch(setUser(data.data))
                    }
                } catch (error: any) {
                    console.log(error.message)
                }
            }
        }
        if (id == "edit") {
            navigation.navigate("AddNewAddressScreen", {
                tag: "editAddress",
                selectedIcon: item.addressLabel,
                addressName: item?.addressName,
                addressLatitude: item?.addressLatitude,
                addressLongitude: item?.addressLongitude
            })
        }
    }
    return (<>
        <TouchableOpacity
            onPress={

                () => {

                    if (!edit) {
                        // navigation.navigate("AddNewAddressScreen", {
                        //     tag: "editAddress",
                        //     selectedIcon: item.addressLabel,
                        //     addressName: item?.addressName,
                        //     addressLatitude: item?.addressLatitude,
                        //     addressLongitude: item?.addressLongitude
                        // })
                        dispatch(setDestinationLocation(
                            {
                                destinationLatitude: item?.addressLatitude,
                                destinationLongitude: item?.addressLongitude,
                                destinationAddress: item?.addressName
                            }
                        ))
                        navigation.popTo("FindDestinationScreen");
                    }
                }

            }
            activeOpacity={0.7} style={styles.itemContainer}>
            <View style={styles.itemIcon}>
                {
                    item.addressLabel == "Home" && (<Entypo name="home" size={20} color="#555" />)
                }
                {
                    item.addressLabel == "Work" && (<MaterialIcons name="work" size={20} color="#555" />)
                }
                {
                    item.addressLabel !== "Home" && item.addressLabel !== "Work" && (
                        <FontAwesome name="bookmark" size={20} color="#555" />
                    )
                }
            </View>
            <View style={styles.addressContainer}>
                <View style={{}}>
                    <View>
                        <Text>
                            {item.addressLabel}
                        </Text>
                    </View>
                    <View>
                        <Text style={{ color: "#555" }}>
                            {
                                item?.addressName !== "" ? item.addressName : "Set an address"
                            }
                        </Text>
                    </View>
                </View>
                <Pressable onPress={() => {
                    if (edit) {
                        console.log(edit)

                    }
                }}>
                    {!edit && (<Entypo name="chevron-small-right" size={24} color="#777" />)}



                </Pressable>
                {
                    edit && (
                        <MenuView
                            ref={menuRef}

                            onPressAction={({ nativeEvent }) => {
                                //   console.warn(JSON.stringify(nativeEvent));
                                handlePressAction(nativeEvent.event);
                            }}
                            actions={[
                                {
                                    id: 'edit',
                                    title: 'Edit',
                                    titleColor: '#2367A2',


                                },

                                {
                                    id: 'delete',
                                    title: 'Delete',
                                    attributes: {
                                        destructive: true,
                                    },

                                },
                            ]}
                            shouldOpenOnLongPress={false}
                        >
                            <Entypo name="dots-three-vertical" size={24} color="#777" />
                        </MenuView>
                    )
                }

            </View>
        </TouchableOpacity>
    </>)
}